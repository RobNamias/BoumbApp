<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class UserPasswordHasher implements ProcessorInterface
{
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private readonly ProcessorInterface $processor,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly EntityManagerInterface $entityManager
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        file_put_contents('php://stderr', "UserPasswordHasher: Processing...\n");

        if (!$data instanceof User) {
            file_put_contents('php://stderr', "UserPasswordHasher: Not a User instance.\n");
            return $this->processor->process($data, $operation, $uriVariables, $context);
        }

        file_put_contents('php://stderr', "UserPasswordHasher: User found. Email: " . $data->getEmail() . "\n");

        if ($data->getPlainPassword()) {
            file_put_contents('php://stderr', "UserPasswordHasher: Hashing password...\n");
            $hashedPassword = $this->passwordHasher->hashPassword(
                $data,
                $data->getPlainPassword()
            );
            $data->setPassword($hashedPassword);
            $data->eraseCredentials();
        } else {
             file_put_contents('php://stderr', "UserPasswordHasher: No plainPassword found!\n");
        }

        // Force manual persist/flush to guarantee persistence
        file_put_contents('php://stderr', "UserPasswordHasher: Persisting and Flushing...\n");
        $this->entityManager->persist($data);
        $this->entityManager->flush();
        file_put_contents('php://stderr', "UserPasswordHasher: Done.\n");

        return $data;
    }
}
