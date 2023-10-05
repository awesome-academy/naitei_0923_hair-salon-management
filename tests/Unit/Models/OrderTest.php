<?php

namespace Tests\Unit\Models;

use App\Models\Bill;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use PHPUnit\Framework\TestCase;
use Tests\Unit\ModelTestCase;

class OrderTest extends ModelTestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function testModelConfiguration()
    {
        $this->runConfigurationAssertions(
            new Order(),
            [],
            [],
            [],
            [],
            ['id' => 'int'],
            ['created_at', 'updated_at'],
            'id',
            'orders'
        );
    }

    public function testBillRelation()
    {
        $model = new Order();
        $relation = $model->bill();

        $this->assertHasOneRelation(
            $relation,
            new Order(),
            new Bill(),
            'order_id',
            'id'
        );
    }

    public function testCustomerRelation()
    {
        $model = new Order();
        $relation = $model->customer();

        $this->assertBelongsToRelation(
            $relation,
            new Order(),
            new Customer(),
            'customer_id',
            'id'
        );
    }

    public function testProductsRelation()
    {
        $model = new Order();
        $relation = $model->products();

        $this->assertBelongsToManyRelation(
            $relation,
            new Order(),
            new Product(),
            'order_product.order_id',
            'order_product.product_id'
        );
    }
}
