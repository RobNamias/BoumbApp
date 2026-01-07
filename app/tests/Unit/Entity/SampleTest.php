<?php

namespace App\Tests\Unit\Entity;

use App\Entity\Sample;
use App\Entity\User;
use PHPUnit\Framework\TestCase;

class SampleTest extends TestCase
{
    public function testSampleInitialization(): void
    {
        $sample = new Sample();
        
        $this->assertNull($sample->getId());
        $this->assertNotNull($sample->getCreatedAt());
        $this->assertNull($sample->getOwner()); // Usine par défaut
    }

    public function testSampleSettersAndGetters(): void
    {
        $sample = new Sample();
        $user = new User();
        $name = 'Kick 808';
        $path = '/samples/kick.wav';
        $category = 'Kick';
        $duration = 0.5;

        $sample->setName($name);
        $sample->setFilePath($path);
        $sample->setCategory($category);
        $sample->setDuration($duration);
        $sample->setOwner($user);

        $this->assertSame($name, $sample->getName());
        $this->assertSame($path, $sample->getFilePath());
        $this->assertSame($category, $sample->getCategory());
        $this->assertSame($duration, $sample->getDuration());
        $this->assertSame($user, $sample->getOwner());
    }
}
