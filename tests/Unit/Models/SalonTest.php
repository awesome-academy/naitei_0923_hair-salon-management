<?php

namespace Tests\Unit\Models;

use App\Models\Category;
use App\Models\Salon;
use App\Models\User;
use App\Models\Customer;
use App\Models\Registration;
use App\Models\Package;
use Tests\Unit\ModelTestCase;

class SalonTest extends ModelTestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function testModelConfiguration()
    {
        $this->runConfigurationAssertions(
            new Salon(),
            ['*'],
            [],
            ['*'],
            [],
            ['id' => 'int'],
            ['created_at', 'updated_at'],
            'id',
            'salons'
        );
    }
    
    public function testUserRelation()
    {
        $model = new Salon();
        $relation = $model->users();

        $this->assertBelongsToManyRelation(
            $relation,
            new Salon(),
            new User(),
            'salon_user.salon_id',
            'salon_user.user_id'
        );
    }

    public function testCategoryRelation()
    {
        $model = new Salon();
        $relation = $model->categories();

        $this->assertHasManyRelation($relation, new Salon(), new Category(), 'salon_id', 'id');
    }

    public function testCustomerRelation()
    {
        $model = new Salon();
        $relation = $model->customers();

        $this->assertHasManyRelation($relation, new Salon(), new Customer(), 'salon_id', 'id');
    }

    public function testRegistrationRelationn()
    {
        $model = new Salon();
        $relation = $model->registration();

        $this->assertBelongsToRelation($relation, new Salon(), new Registration(), 'owner_email', 'email');
    }

    public function testPackageRelationn()
    {
        $model = new Salon();
        $relation = $model->package();

        $this->assertBelongsToRelation($relation, new Salon(), new Package(), 'package_id', 'id');
    }
}
