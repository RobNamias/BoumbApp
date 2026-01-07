<?php

namespace App\Tests\Integration\DataFixtures;

use App\Entity\Project;
use App\Entity\Sample;
use App\Entity\SynthPreset;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class AppFixturesTest extends KernelTestCase
{
    // Need to reset manually or use a trait if available. 
    // Since we are testing manual fixtures, we might just load them.
    // For simplicity in this environment, we assume the DB is clean or we can clean it.
    
    private EntityManagerInterface $entityManager;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->entityManager = static::getContainer()->get(EntityManagerInterface::class);
    }

    public function testFixturesLoadCorrectly(): void
    {
        // 1. Purge & Load Fixtures (Manual call or via command)
        // We use the command to ensure it mimics real usage.
        $application = new \Symfony\Bundle\FrameworkBundle\Console\Application(self::$kernel);
        $application->setAutoExit(false);

        $input = new \Symfony\Component\Console\Input\ArrayInput([
            'command' => 'doctrine:fixtures:load',
            '--no-interaction' => true,
            '--purge-with-truncate' => true, // Ensure clean slate
        ]);
        
        $output = new \Symfony\Component\Console\Output\BufferedOutput();
        $code = $application->run($input, $output);

        $this->assertEquals(0, $code, 'Fixtures loading failed: ' . $output->fetch());

        // 2. Assert Users
        $admin = $this->entityManager->getRepository(User::class)->findOneBy(['email' => 'admin@boumbapp.com']);
        $this->assertNotNull($admin, 'Admin user should exist');
        $this->assertContains('ROLE_ADMIN', $admin->getRoles());

        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => 'user@boumbapp.com']);
        $this->assertNotNull($user, 'Standard user should exist');

        // 3. Assert Samples
        $kick = $this->entityManager->getRepository(Sample::class)->findOneBy(['name' => 'Kick 808']);
        $this->assertNotNull($kick, 'Kick 808 sample should exist');
        
        // 4. Assert Presets
        $bass = $this->entityManager->getRepository(SynthPreset::class)->findOneBy(['name' => 'Retro Bass']);
        $this->assertNotNull($bass, 'Retro Bass preset should exist');

        // 5. Assert Project
        $project = $this->entityManager->getRepository(Project::class)->findOneBy(['name' => 'Demo Track 2025']);
        $this->assertNotNull($project, 'Demo project should exist');
        $this->assertEquals($user->getId(), $project->getOwner()->getId(), 'Demo project should belong to standard user');
        
        // 6. Assert Project Version & Data
        $versions = $project->getProjectVersions();
        $this->assertGreaterThan(0, $versions->count(), 'Demo project should have at least one version');
        $latestVersion = $versions->last();
        $data = $latestVersion->getData();
        
        $this->assertArrayHasKey('tracks', $data);
        $this->assertCount(2, $data['tracks'], 'Demo project should have 2 tracks');
        $this->assertArrayHasKey('effects', $data['tracks'][1], 'Track 2 should have effects'); // Checking the new requirement
    }
}
