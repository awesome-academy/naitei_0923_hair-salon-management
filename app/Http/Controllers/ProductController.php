<?php
namespace App\Http\Controllers;

use App\Http\Requests\UpdateProductRequest;
use App\Http\Requests\StoreProductRequest;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use Inertia\Inertia;
use DB;
use Exception;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $products = Product::all();

        foreach ($products as $product) {
            $product->category = Category::find($product->category_id)->name;
            $product->is_active = config('app.product_active')[$product->is_active];
        }

        $sortedProducts = $products->sortBy(
            [
                ['is_active', 'desc'],
                ['created_at', 'desc'],
            ]
        );
        return Inertia::render(
            'products/Index.jsx',
            [
                ['products' => $sortedProducts],
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
        $categories = Category::select('id', 'name')->get()->toArray();
        return Inertia::render(
            'products/Create.jsx',
            [
                [
                    'categories' => $categories,
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
    public function store(StoreProductRequest $request)
    {
        $validated = $request->validated();

        try {
            DB::table('products')->insert(
                [
                    'name' => $validated['name'],
                    'unit' => $validated['unit'],
                    'cost' => $validated['cost'],
                    'description' => $validated['description'],
                    'category_id' => $validated['category'],
                ]
            );
        } catch (Exception $e) {
            return redirect()->back()->withErrors(
                [
                    'store' => $e.getMessage(),
                ]
            );
        }
        return redirect()->route('products.index');
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show(Product $product)
    {
        $product->category = Category::find($product->category_id)->name;

        return Inertia::render(
            'products/Show.jsx',
            [
                [
                    'product' => $product,
                ],
            ]
        );
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $product = Product::find($id);
        $categories = Category::select('id', 'name')->get()->toArray();

        return Inertia::render(
            'products/Edit.jsx',
            [
                [
                    'product' => $product,
                    'categories' => $categories,
                ],
            ]
        );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int                      $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateProductRequest $request, $id)
    {
        $validated = $request->validated();

        try {
            DB::table('products')->where('id', intval($id))
                ->update(
                    [
                        'name' => $validated['name'],
                        'unit' => $validated['unit'],
                        'cost' => $validated['cost'],
                        'description' => $validated['description'],
                        'category_id' => $validated['category'],
                    ]
                );
        } catch (Exception $e) {
            return redirect()->back()->withErrors(
                [
                    'update' => $e.getMessage(),
                ]
            );
        }
        return redirect()->route('products.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function inactive($id)
    {
        $product_active = collect(config('app.product_active'));
        $unactive_id = $product_active->search('False');

        try {
            DB::table('products')->where('id', $id)->update(['is_active' => $unactive_id]);
        } catch (Exception $e) {
            return redirect()->back()->withErrors(
                [
                    'inactive' => $e.getMessage(),
                ]
            );
        }
        return redirect()->route('products.index');
    }
}
