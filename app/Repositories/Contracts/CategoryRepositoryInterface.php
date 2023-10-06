<?php

namespace App\Repositories\Contracts;

interface CategoryRepositoryInterface extends RepositoryInterface
{
    public function getAll();

    public function create($attributes = []);

    public function update($id, $attributes = []);

    public function find($id);

    public function delete($id);
}
