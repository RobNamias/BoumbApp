<?php

namespace App\Tests\Unit\Entity;

use App\Entity\SynthPreset;
use App\Entity\User;
use PHPUnit\Framework\TestCase;

class SynthPresetTest extends TestCase
{
    public function testSynthPresetInitialization(): void
    {
        $preset = new SynthPreset();
        
        $this->assertNull($preset->getId());
        $this->assertNotNull($preset->getCreatedAt());
        $this->assertNull($preset->getOwner()); // Usine par défaut
    }

    public function testSynthPresetSettersAndGetters(): void
    {
        $preset = new SynthPreset();
        $user = new User();
        $name = 'Bass Pluck';
        $synthType = 'FMSynth';
        $parameters = ['envelope' => ['attack' => 0.1]];

        $preset->setName($name);
        $preset->setSynthType($synthType);
        $preset->setParameters($parameters);
        $preset->setOwner($user);

        $this->assertSame($name, $preset->getName());
        $this->assertSame($synthType, $preset->getSynthType());
        $this->assertSame($parameters, $preset->getParameters());
        $this->assertSame($user, $preset->getOwner());
    }
}
