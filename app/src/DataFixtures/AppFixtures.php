<?php

namespace App\DataFixtures;

use App\Entity\Project;
use App\Entity\ProjectVersion;
use App\Entity\Sample;
use App\Entity\SynthPreset;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $hasher;

    public function __construct(UserPasswordHasherInterface $hasher)
    {
        $this->hasher = $hasher;
    }

    public function load(ObjectManager $manager): void
    {
        // 1. Users
        $admin = new User();
        $admin->setEmail('admin@boumbapp.com');
        $admin->setUsername('Admin');
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setPassword($this->hasher->hashPassword($admin, 'password123'));
        $manager->persist($admin);

        $user = new User();
        $user->setEmail('user@boumbapp.com');
        $user->setUsername('Jean Michel');
        $user->setRoles(['ROLE_USER']);
        $user->setPassword($this->hasher->hashPassword($user, 'password123'));
        $manager->persist($user);

        // 2. Samples (Usine)
        $samplesData = [
            ['name' => 'Kick 808', 'cat' => 'Drums', 'path' => '/library/samples/drums/kick_808.wav', 'dur' => 0.5],
            ['name' => 'Snare 909', 'cat' => 'Drums', 'path' => '/library/samples/drums/snare_909.wav', 'dur' => 0.3],
            ['name' => 'HiHat Closed', 'cat' => 'Drums', 'path' => '/library/samples/drums/hh_closed.wav', 'dur' => 0.1],
            ['name' => 'Amen Break', 'cat' => 'Loop', 'path' => '/library/samples/loops/amen_break.wav', 'dur' => 4.0],
        ];

        $createdSamples = []; // To cache for project usage if needed

        foreach ($samplesData as $s) {
            $sample = new Sample();
            $sample->setName($s['name']);
            $sample->setCategory($s['cat']);
            $sample->setFilePath($s['path']);
            $sample->setDuration($s['dur']);
            // No owner = Factory
            $manager->persist($sample);
            $createdSamples[$s['name']] = $sample;
        }

        // 3. Synth Presets (Usine)
        $presetsData = [
            ['name' => 'Retro Bass', 'type' => 'BASS', 'params' => ['osc' => 'sawtooth', 'filter' => ['cutoff' => 400]]],
            ['name' => 'Dreamy Pad', 'type' => 'PAD', 'params' => ['osc' => 'sine', 'attack' => 2.0, 'release' => 3.0]],
        ];

        $createdPresets = [];

        foreach ($presetsData as $p) {
            $preset = new SynthPreset();
            $preset->setName($p['name']);
            $preset->setSynthType($p['type']);
            $preset->setParameters($p['params']);
            // No owner = Factory
            $manager->persist($preset);
            $createdPresets[$p['name']] = $preset;
        }

        // 4. Project Demo
        $project = new Project();
        $project->setName('Demo Track 2025');
        $project->setPublic(true);
        $project->setOwner($user);
        $manager->persist($project);

        // 5. Project Version
        $jsonState = [
            "global" => [
                "bpm" => 124,
                "swing" => 0.0,
                "scale" => "C Minor"
            ],
            "tracks" => [
                [
                    "id" => "track-1",
                    "type" => "sampler",
                    "name" => "Kick",
                    "sampleId" => 1, // Reference ID (could be dynamic in real app)
                    "patterns" => [
                        [ "id" => "pat-1", "steps" => [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0] ]
                    ]
                ],
                [
                    "id" => "track-2",
                    "type" => "synth",
                    "name" => "Bass",
                    "presetId" => 1,
                    "effects" => [
                        [ "id" => "fx-1", "type" => "delay", "wet" => 0.5, "time" => 0.3 ]
                    ],
                    "patterns" => [
                        [ "id" => "pat-2", "steps" => [1, 0, 0, 1, 0, 0, 1, 0] ]
                    ]
                ]
            ]
        ];

        $version = new ProjectVersion();
        $version->setProject($project);
        $version->setVersionNumber(1);
        $version->setData($jsonState);
        
        $manager->persist($version);

        $manager->flush();
    }
}
