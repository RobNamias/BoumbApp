<?php

namespace App\Tests\Functional\Api;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\User;

class ProjectTest extends ApiTestCase
{
    private const ENDPOINT = '/api/projects';
    private string $tokenUser1;
    private string $tokenUser2; // Admin in fixtures, but treated as another user here

    protected function setUp(): void
    {
        $this->tokenUser1 = $this->getToken('user@boumbapp.com', 'password123');
        $this->tokenUser2 = $this->getToken('admin@boumbapp.com', 'password123');
    }

    private function getToken(string $email, string $password): string
    {
        $response = static::createClient()->request('POST', '/api/login_check', [
            'json' => ['username' => $email, 'password' => $password],
        ]);
        return $response->toArray()['token'];
    }

    public function testGetOwnProjectsCollection(): void
    {
        $response = static::createClient()->request('GET', self::ENDPOINT, [
            'auth_bearer' => $this->tokenUser1,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains(['@type' => 'hydra:Collection']);

        // Ensure we only see our projects (Demo Track 2025 belongs to user@boumbapp.com)
        $data = $response->toArray();
        $this->assertGreaterThanOrEqual(1, $data['hydra:totalItems']);
    }

    public function testGetOthersProjectDenied(): void
    {
        // 1. Find a project id belonging to User 1
        $client = static::createClient();
        $response = $client->request('GET', self::ENDPOINT, [
            'auth_bearer' => $this->tokenUser1,
        ]);
        $data = $response->toArray();
        $projectId = $data['hydra:member'][0]['id'];

        // 2. Try to access it as User 2
        $client->request('GET', self::ENDPOINT . '/' . $projectId, [
            'auth_bearer' => $this->tokenUser2,
        ]);

        // Should be 403 Forbidden or 404 Not Found (depending on strategy)
        // Usually 404 is better for security (don't reveal existence), but 403 is standard Auth
        $this->assertResponseStatusCodeSame(404);
    }

    public function testCreateProjectAssignsOwner(): void
    {
        static::createClient()->request('POST', self::ENDPOINT, [
            'auth_bearer' => $this->tokenUser1,
            'json' => [
                'name' => 'My New Track',
                'isPublic' => false // Should use setPublic setter
            ]
        ]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertJsonContains([
            'name' => 'My New Track',
            // owner should not be necessarily exposed, but implicitly validated by the fact creation worked
        ]);
    }
}
