<?php

namespace Tests\Unit\Models;

use App\Models\Bill;
use App\Models\Order;
use Tests\Unit\ModelTestCase;

class BillTest extends ModelTestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function testModelConfiguration()
    {
        $this->runConfigurationAssertions(
            new Bill(),
            ['*'],
            [],
            ['*'],
            [],
            ['id' => 'int'],
            ['created_at', 'updated_at'],
            'id',
            'bills'
        );
    }

    public function testOrderRelation()
    {
        $model = new Bill();
        $relation = $model->order();

        $this->assertBelongsToRelation($relation, new Bill(), new Order(), 'order_id', 'id');
    }
}
