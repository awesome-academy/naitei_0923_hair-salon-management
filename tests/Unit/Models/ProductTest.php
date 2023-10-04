<?php

namespace Tests\Unit\Models;

use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use Tests\Unit\ModelTestCase;

class ProductTest extends ModelTestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function testModelConfiguration()
    {
        $this->runConfigurationAssertions(
            new Product(),
            ['*'],
            [],
            ['*'],
            [],
            ['id' => 'int'],
            ['created_at', 'updated_at'],
            'id',
            'products'
        );
    }

    public function testCategoryRelation()
    {
        $product = new Product();
        $category = $product->category();

        $this->assertBelongsToRelation($category, new Product(), new Category(), 'category_id', 'id');
    }

    public function testOrdersRelation()
    {
        $product = new Product();
        $orders = $product->orders();

        $this->assertBelongsToManyRelation(
            $orders,
            new Product(),
            new Order(),
            'order_product.product_id',
            'order_product.order_id'
        );
    }
}
