<?php

namespace Tests\Unit\Models;

use App\Models\Package;
use App\Models\Salon;
use App\Models\Registration;
use Tests\Unit\ModelTestCase;

class PackageTest extends ModelTestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function testModelConfiguration()
    {
        $this->runConfigurationAssertions(
            new Package(),
            ['*'],
            [],
            ['*'],
            [],
            ['id' => 'int'],
            ['created_at', 'updated_at'],
            'id',
            'packages'
        );
    }

    public function testSalonsRelation()
    {
        $package = new Package();
        $salons = $package->salons();

        $this->assertHasManyRelation($salons, new Package(), new Salon(), 'package_id', 'id');
    }

    public function testRegistrationsRelation()
    {
        $package = new Package();
        $registrations = $package->registrations();

        $this->assertHasManyRelation($registrations, new Package(), new Registration(), 'package_id', 'id');
    }
}
