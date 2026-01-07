<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

#[AsEventListener(event: 'lexik_jwt_authentication.on_jwt_created', method: 'onJWTCreated')]
class JWTCreatedListener
{
    public function onJWTCreated(JWTCreatedEvent $event): void
    {
        $payload = $event->getData();
        $user = $event->getUser();

        // Security: The 'username' payload is used by Lexik to load the user.
        // Since our UserProvider looks up by 'email', this MUST be the email.
        if (method_exists($user, 'getEmail')) {
            $payload['username'] = $user->getEmail();
        }

        // Display: Add the real Producer Name as a separate claim
        if (method_exists($user, 'getUsername')) {
            $payload['pseudo'] = $user->getUsername();
        }
        
        if (method_exists($user, 'getId')) {
            $payload['id'] = $user->getId();
        }

        $event->setData($payload);
    }
}
