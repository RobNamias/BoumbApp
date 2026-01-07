<?php

namespace App\Tests\Unit\Entity;

use App\Entity\Project;
use App\Entity\ProjectVersion;
use PHPUnit\Framework\TestCase;

class ProjectVersionTest extends TestCase
{
    public function testProjectVersionInitialization(): void
    {
        $version = new ProjectVersion();
        
        $this->assertNull($version->getId());
        $this->assertNotNull($version->getCreatedAt());
    }

    public function testProjectVersionSettersAndGetters(): void
    {
        $version = new ProjectVersion();
        $project = new Project();
        $data = ['global' => ['bpm' => 120]];
        $versionNumber = 1;

        $version->setProject($project);
        $version->setData($data);
        $version->setVersionNumber($versionNumber);

        $this->assertSame($project, $version->getProject());
        $this->assertSame($data, $version->getData());
        $this->assertSame($versionNumber, $version->getVersionNumber());
    }
}
