<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Exception;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $categories = Category::with('products')
            ->where('salon_id', session('selectedSalon'))
            ->get();
        
        foreach ($categories as $category) {
            $category = clone $this->aggregateCategoryInformation($category);
        }

        $sortedCategories = $categories->sortBy(
            [
                ['is_active', 'desc'],
            ]
        );

        return Inertia::render(
            'categories/Index.jsx',
            [
                [
                    'categories' => $sortedCategories,
                ],
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return Inertia::render(
            'categories/Create.jsx',
            [
                [
                    'category_active' => config('app.category_active'),
                ],
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreCategoryRequest $request)
    {
        $validated = $request->validated();
        
        try {
            DB::table('categories')->insert(
                [
                    'name' => $validated['name'],
                    'salon_id' => session('selectedSalon'),
                    'is_active' => $validated['active'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        } catch (Exception $e) {
            return redirect()->back()->withErrors(
                [
                    'store' => $e->getMessage(),
                ]
            );
        }

        return redirect()->route('categories.index');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function show(Category $category)
    {
        $category = Category::with('products')->find($category->id);
        $category = clone $this->aggregateCategoryInformation($category);

        return Inertia::render(
            'categories/Show.jsx',
            [
                [
                    'category' => $category,
                ],
            ]
        );
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function edit(Category $category)
    {
        return Inertia::render(
            'categories/Edit',
            [
                [
                    'category' => $category,
                    'category_active' => config('app.category_active'),
                ],
            ]
        );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateCategoryRequest $request, $id)
    {
        try {
            $validated = $request->validated();
            DB::table('categories')->where('id', intval($id))
                ->update(
                    [
                        'name' => $validated['name'],
                        'is_active' => $validated['active'],
                        'updated_at' => now(),
                    ]
                );
        } catch (Exception $e) {
            return redirect()->back()->withErrors(
                [
                    'update' => __('There was an error'),
                ]
            );
        }

        return redirect()->route('categories.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function destroy(Category $category)
    {
        try {
            DB::transaction(
                function () use ($category) {
                    $category->delete();
                }
            );
        } catch (Exception $e) {
            return redirect()->back()->withErrors(
                [
                    'delete' => __('There was an error'),
                ]
            );
        }
        
        return redirect()->route('categories.index');
    }

    private function aggregateCategoryInformation(Category $category)
    {
        $is_active = config('app.category_active')[$category->is_active];
        $category->is_active = $is_active;
        $products = $category->products;
        $category->product_type = count($products);
        
        $product_number = 0;

        foreach ($products as $product) {
            $product_number += $product->quantity;
            $product->is_active = config('app.product_active')[$product->is_active];
        }

        $category->product_number = $product_number;

        return $category;
    }
}
