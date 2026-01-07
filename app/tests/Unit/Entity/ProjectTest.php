<?php

namespace App\Tests\Unit\Entity;

use App\Entity\Project;
use App\Entity\User;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Validator\Validation;

class ProjectTest extends TestCase
{
    public function testProjectInitialization(): void
    {
        $project = new Project();
        
        $this->assertNull($project->getId());
        $this->assertFalse($project->isPublic(), 'Un projet doit être privé par défaut');
        $this->assertNotNull($project->getCreatedAt());
    }

    public function testProjectSettersAndGetters(): void
    {
        $project = new Project();
        $name = 'My Awesome Track';
        $user = new User();

        $project->setName($name);
        $project->setOwner($user);
        $project->setPublic(true);

        $this->assertSame($name, $project->getName());
        $this->assertSame($user, $project->getOwner());
        $this->assertTrue($project->isPublic());
    }

    public function testProjectValidation(): void
    {
        $validator = Validation::createValidatorBuilder()
            ->enableAttributeMapping()
            ->getValidator();

        $project = new Project();
        $project->setName(''); // Invalid (NotBlank)

        $errors = $validator->validate($project);

        $this->assertGreaterThan(0, count($errors), 'Le nom ne doit pas être vide');
    }
}
