<?php

namespace App\Tests\Unit\Entity;

use App\Entity\User;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Validator\Validation;

class UserTest extends TestCase
{
    public function testUserInitialization(): void
    {
        $user = new User();
        
        $this->assertContains('ROLE_USER', $user->getRoles());
        $this->assertNull($user->getId());
    }

    public function testUserSettersAndGetters(): void
    {
        $user = new User();
        $email = 'test@example.com';
        $username = 'testuser';
        $password = 'hashed_password';

        $user->setEmail($email);
        $user->setUsername($username);
        $user->setPassword($password);

        $this->assertSame($email, $user->getEmail());
        $this->assertSame($username, $user->getUsername());
        $this->assertSame($password, $user->getPassword());
    }

    public function testUserValidation(): void
    {
        $validator = Validation::createValidatorBuilder()
            ->enableAttributeMapping()
            ->getValidator();

        $user = new User();
        $user->setEmail('invalid-email'); // Invalid
        $user->setUsername(''); // Invalid (NotBlank)
        $user->setPassword('123456');

        $errors = $validator->validate($user);

        $this->assertGreaterThan(0, count($errors), 'Validation should fail for invalid data');
        
        // Optional: Check specific errors
        // $this->assertEquals('This value is not a valid email address.', $errors[0]->getMessage());
    }
}
