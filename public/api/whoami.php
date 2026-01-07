<?php

use App\Kernel;
use App\Entity\Project;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;

require_once dirname(dirname(__DIR__)) . '/vendor/autoload_runtime.php';

return function (array $context) {
    $kernel = new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);

    return new class($kernel) {
        private $kernel;

        public function __construct($kernel) {
            $this->kernel = $kernel;
        }

        public function __invoke(Request $request) {
            $this->kernel->boot();
            $container = $this->kernel->getContainer();
            
            // 1. Check Database Projects Raw
            /** @var EntityManagerInterface $em */
            $em = $container->get('doctrine.orm.entity_manager');
            $repo = $em->getRepository(Project::class);
            $allProjects = $repo->findAll();
            $countAll = count($allProjects);

            // 2. Decode Token (Naive)
            $authHeader = $request->headers->get('Authorization');
            $userEmail = 'N/A';
            $userProjects = -1;

            if ($authHeader && preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
                $token = $matches[1];
                $parts = explode('.', $token);
                if (count($parts) === 3) {
                    $payload = json_decode(base64_decode($parts[1]), true);
                    $username = $payload['username'] ?? 'missing';
                    // We expect username to be email now
                    $userEmail = $username;
                    
                    // Find User
                    $userRepo = $em->getRepository(User::class);
                    $user = $userRepo->findOneBy(['email' => $userEmail]);
                    
                    if ($user) {
                        // Count user projects
                        // Check if filtering logic exists?
                        // Just count projects where owner = user
                        $userProjects = $repo->count(['owner' => $user]);
                    }
                }
            }

            $response = [
                'total_projects_in_db' => $countAll,
                'token_user_email' => $userEmail,
                'user_owned_projects' => $userProjects,
                'first_5_projects' => array_map(fn($p) => [
                    'id' => $p->getId(),
                    'name' => $p->getName(),
                    'owner' => $p->getOwner() ? $p->getOwner()->getEmail() : 'NULL',
                    'createdAt' => $p->getCreatedAt()->format('Y-m-d H:i:s'),
                ], array_slice($allProjects, 0, 5))
            ];

            return new \Symfony\Component\HttpFoundation\JsonResponse($response);
        }
    };
};
