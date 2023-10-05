<?php

namespace Tests\Unit\Models;

use App\Models\Category;
use App\Models\Salon;
use App\Models\Product;
use Tests\Unit\ModelTestCase;

class CategoryTest extends ModelTestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function testModelConfiguration()
    {
        $this->runConfigurationAssertions(
            new Category(),
            ['*'],
            [],
            ['*'],
            [],
            ['id' => 'int'],
            ['created_at', 'updated_at'],
            'id',
            'categories'
        );
    }

    public function testProductRelation()
    {
        $model = new Category();
        $relation = $model->products();

        $this->assertHasManyRelation($relation, new Category(), new Product(), 'category_id', 'id');
    }

    public function testSalonRelationn()
    {
        $model = new Category();
        $relation = $model->salon();

        $this->assertBelongsToRelation($relation, new Category(), new Salon(), 'salon_id', 'id');
    }
}
