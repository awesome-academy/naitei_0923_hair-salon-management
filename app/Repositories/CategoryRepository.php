<?php

namespace App\Repositories;

use App\Models\Category;
use App\Repositories\Contracts\RepositoryInterface;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use Illuminate\Support\Facades\DB;

class CategoryRepository extends AbstractRepository implements CategoryRepositoryInterface
{
    public function getModel()
    {
        return Category::class;
    }

    public function getAll()
    {
        return $this->model->with('products')
            ->where('salon_id', session('selectedSalon'))
            ->get()
            ->sortBy([
                ['is_active', 'desc'],
            ]);
    }

    public function create($attributes = [])
    {
        if (isset($attributes['name']) && isset($attributes['is_active'])) {
            $category = new Category();
            $category->name = $attributes['name'];
            $category->salon_id = session('selectedSalon');
            $category->is_active = $attributes['is_active'];
            $category->save();
        }
    }

    public function update($id, $attributes = [])
    {
        if (isset($attributes['name']) && isset($attributes['is_active'])) {
            $category = Category::find($id);
            $category->name = $attributes['name'];
            $category->is_active = $attributes['is_active'];
            $category->save();
        }
    }

    public function find($id)
    {
        return Category::with('products')->find($id);
    }

    public function delete($id)
    {
        $category = Category::find($id);

        DB::transaction(
            function () use ($category) {
                $category->delete();
            }
        );
    }
}
