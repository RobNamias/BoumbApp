<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Project;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;


class ProjectProcessor implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private Security $security
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        error_log("ProjectProcessor: START");
        
        if ($data instanceof Project && $data->getOwner() === null) {
            $user = $this->security->getUser();
            if ($user instanceof User) {
                $data->setOwner($user);
                error_log("ProjectProcessor: Owner Set to " . $user->getUserIdentifier());
            }
        }

        // Manual Persist
        $this->entityManager->persist($data);
        $this->entityManager->flush();
        error_log("ProjectProcessor: Persisted & Flushed");

        return $data;
    }
}
