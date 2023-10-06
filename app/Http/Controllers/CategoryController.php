<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Repositories\CategoryRepository;
use Illuminate\Http\Request;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Exception;

class CategoryController extends Controller
{
    /**
     * @var CategoryRepositoryInterface
     */
    private $categoryRepository;

    public function __construct(CategoryRepository $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $categories = $this->categoryRepository->getAll();

        foreach ($categories as $category) {
            $category = clone $this->aggregateCategoryInformation($category);
        }

        return Inertia::render(
            'categories/Index.jsx',
            [
                [
                    'categories' => $categories,
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
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreCategoryRequest $request)
    {
        $validated = $request->validated();
        $validated['is_active'] = $validated['active'];
        try {
            $this->categoryRepository->create($validated);
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
     * @param  \App\Models\Category $category
     * @return \Illuminate\Http\Response
     */
    public function show(Category $category)
    {
        $category = $this->categoryRepository->find($category->id);

        return Inertia::render(
            'categories/Show.jsx',
            [
                [
                    'category' => $this->aggregateCategoryInformation($category),
                ],
            ]
        );
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Category $category
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
     * @param  \Illuminate\Http\Request $request
     * @param  \App\Models\Category     $category
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateCategoryRequest $request, $id)
    {
        try {
            $validated = $request->validated();
            $validated['is_active'] = $validated['active'];
            $this->categoryRepository->update($id, $validated);
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
     * @param  \App\Models\Category $category
     * @return \Illuminate\Http\Response
     */
    public function destroy(Category $category)
    {
        try {
            $this->categoryRepository->delete($category->id);
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
