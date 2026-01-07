<?php

namespace App\Tests\Functional\Api;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\User;

class CatalogTest extends ApiTestCase
{
    private string $token;

    protected function setUp(): void
    {
        // 1. Authenticate to get a token
        $response = static::createClient()->request('POST', '/api/login_check', [
            'json' => [
                'username' => 'user@boumbapp.com', // From Fixtures
                'password' => 'password123',
            ],
        ]);
        
        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->token = $data['token'];
    }

    public function testGetSamplesCollection(): void
    {
        static::createClient()->request('GET', '/api/samples', [
            'auth_bearer' => $this->token,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@context' => '/api/contexts/Sample',
            '@id' => '/api/samples',
            '@type' => 'hydra:Collection',
        ]);
    }

    public function testGetSynthPresetsCollection(): void
    {
        static::createClient()->request('GET', '/api/synth_presets', [
            'auth_bearer' => $this->token,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@context' => '/api/contexts/SynthPreset',
            '@id' => '/api/synth_presets',
            '@type' => 'hydra:Collection',
        ]);
    }
}
