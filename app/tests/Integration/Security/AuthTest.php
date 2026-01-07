<?php

namespace App\Tests\Integration\Security;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class AuthTest extends WebTestCase
{
    private $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        // Database is assumed to be populated with AppFixtures (User: user@boumbapp.com / password123)
    }

    public function testLoginSuccess(): void
    {
        $this->client->request(
            'POST',
            '/api/login_check',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'username' => 'user@boumbapp.com',
                'password' => 'password123',
            ])
        );

        $response = $this->client->getResponse();
        
        // Debug output if fails
        if ($response->getStatusCode() !== 200) {
            fwrite(STDERR, $response->getContent() . "\n");
        }

        $this->assertResponseIsSuccessful();
        $this->assertJson($response->getContent());
        
        $data = json_decode($response->getContent(), true);
        $this->assertArrayHasKey('token', $data, 'Response should contain a JWT token');
    }

    public function testLoginFailure(): void
    {
        $this->client->request(
            'POST',
            '/api/login_check',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'username' => 'user@boumbapp.com',
                'password' => 'wrong_password',
            ])
        );

        $this->assertResponseStatusCodeSame(401);
    }
}
