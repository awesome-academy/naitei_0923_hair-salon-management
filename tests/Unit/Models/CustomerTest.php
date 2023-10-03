<?php

namespace Tests\Unit\Models;

use App\Models\Customer;
use App\Models\Order;
use App\Models\Salon;
use PHPUnit\Framework\TestCase;
use Tests\Unit\ModelTestCase;

class CustomerTest extends ModelTestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function testModelConfiguration()
    {
        $this->runConfigurationAssertions(
            new Customer(),
            [],
            [],
            [],
            [],
            ['id' => 'int'],
            ['created_at', 'updated_at'],
            'id',
            'customers'
        );
    }

    public function testOrderRelation()
    {
        $model = new Customer();
        $relation = $model->orders();

        $this->assertHasManyRelation($relation, new Customer(), new Order(), 'customer_id', 'id');
    }

    public function testSalonRelation()
    {
        $model = new Customer();
        $relation = $model->salon();

        $this->assertBelongsToRelation($relation, new Customer(), new Salon(), 'salon_id', 'id');
    }
}
