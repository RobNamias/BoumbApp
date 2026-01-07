<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251206172243 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE "project" (id SERIAL NOT NULL, owner_id INT NOT NULL, name VARCHAR(100) NOT NULL, is_public BOOLEAN NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_2FB3D0EE7E3C61F9 ON "project" (owner_id)');
        $this->addSql('COMMENT ON COLUMN "project".created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE "project_version" (id SERIAL NOT NULL, project_id INT NOT NULL, version_number INT NOT NULL, data JSON NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_2902DFA6166D1F9C ON "project_version" (project_id)');
        $this->addSql('COMMENT ON COLUMN "project_version".created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE "sample" (id SERIAL NOT NULL, owner_id INT DEFAULT NULL, name VARCHAR(100) NOT NULL, file_path VARCHAR(255) NOT NULL, category VARCHAR(50) NOT NULL, duration DOUBLE PRECISION DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_F10B76C37E3C61F9 ON "sample" (owner_id)');
        $this->addSql('COMMENT ON COLUMN "sample".created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE "synth_preset" (id SERIAL NOT NULL, owner_id INT DEFAULT NULL, name VARCHAR(100) NOT NULL, synth_type VARCHAR(50) NOT NULL, parameters JSON NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_840138C67E3C61F9 ON "synth_preset" (owner_id)');
        $this->addSql('COMMENT ON COLUMN "synth_preset".created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE "user" (id SERIAL NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, username VARCHAR(50) NOT NULL, preferences JSON DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON "user" (email)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649F85E0677 ON "user" (username)');
        $this->addSql('COMMENT ON COLUMN "user".created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE "project" ADD CONSTRAINT FK_2FB3D0EE7E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE "project_version" ADD CONSTRAINT FK_2902DFA6166D1F9C FOREIGN KEY (project_id) REFERENCES "project" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE "sample" ADD CONSTRAINT FK_F10B76C37E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE "synth_preset" ADD CONSTRAINT FK_840138C67E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE "project" DROP CONSTRAINT FK_2FB3D0EE7E3C61F9');
        $this->addSql('ALTER TABLE "project_version" DROP CONSTRAINT FK_2902DFA6166D1F9C');
        $this->addSql('ALTER TABLE "sample" DROP CONSTRAINT FK_F10B76C37E3C61F9');
        $this->addSql('ALTER TABLE "synth_preset" DROP CONSTRAINT FK_840138C67E3C61F9');
        $this->addSql('DROP TABLE "project"');
        $this->addSql('DROP TABLE "project_version"');
        $this->addSql('DROP TABLE "sample"');
        $this->addSql('DROP TABLE "synth_preset"');
        $this->addSql('DROP TABLE "user"');
    }
}
