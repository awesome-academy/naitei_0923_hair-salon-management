<?php

namespace Tests\Unit\Models;

use App\Models\Registration;
use App\Models\Package;
use App\Models\Salon;
use Tests\Unit\ModelTestCase;

class RegistrationTest extends ModelTestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function testModelConfiguration()
    {
        $this->runConfigurationAssertions(
            new Registration(),
            ['*'],
            [],
            ['*'],
            [],
            ['id' => 'int'],
            ['created_at', 'updated_at'],
            'id',
            'registrations'
        );
    }

    public function testPackageRelation()
    {
        $registration = new Registration();
        $package = $registration->package();

        $this->assertBelongsToRelation($package, new Registration(), new Package(), 'package_id', 'id');
    }

    public function testSalonRelation()
    {
        $registration = new Registration();
        $salon = $registration->salon();

        $this->assertHasOneRelation($salon, new Registration(), new Salon(), 'owner_email', 'email');
    }
}
