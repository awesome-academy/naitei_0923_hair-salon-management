<?php

namespace Tests\Unit;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Tests\TestCase;

abstract class ModelTestCase extends TestCase
{
    protected function runConfigurationAssertions(
        Model $model,
        $fillable = [],
        $hidden = [],
        $guarded = ['*'],
        $visible = [],
        $casts = ['id' => 'int'],
        $dates = ['created_at', 'updated_at'],
        $primaryKey = 'id',
        $table = null,
        $collectionClass = Collection::class,
        $connection = null
    ) {
        $this->assertEquals($fillable, $model->getFillable());
        $this->assertEquals($hidden, $model->getHidden());
        $this->assertEquals($guarded, $model->getGuarded());
        $this->assertEquals($visible, $model->getVisible());
        $this->assertEquals($casts, $model->getCasts());
        $this->assertEquals($dates, $model->getDates());
        $this->assertEquals($primaryKey, $model->getKeyname());

        $c = $model->newCollection();
        $this->assertEquals($collectionClass, get_class($c));

        if ($connection !== null) {
            $this->assertEquals($connection, $model->getConnectionName());
        }
        if ($table !== null) {
            $this->assertEquals($table, $model->getTable());
        }
    }

    protected function assertHasOneRelation(
        $relation,
        Model $model,
        Model $related,
        $foreignKey = null,
        $localKey = null
    ) {
        $this->assertInstanceOf(HasOne::class, $relation);

        $this->assertEquals($model, $relation->getParent());
        $this->assertEquals($related, $relation->getModel());

        if (is_null($foreignKey)) {
            $foreignKey = $model->getForeignKey();
        }

        $this->assertEquals($foreignKey, $relation->getForeignKeyName());

        if (is_null($localKey)) {
            $localKey = $related->getKeyName();
        }
        $this->assertEquals($localKey, $relation->getLocalKeyName());
    }

    protected function assertHasManyRelation(
        $relation,
        Model $model,
        Model $related,
        $foreignKey = null,
        $parentKey = null
    ) {
        $this->assertInstanceOf(HasMany::class, $relation);

        $this->assertEquals($model, $relation->getParent());
        $this->assertEquals($related, $relation->getModel());

        if (is_null($foreignKey)) {
            $foreignKey = $model->getForeignKey();
        }
        $this->assertEquals($foreignKey, $relation->getForeignKeyName());

        if (is_null($parentKey)) {
            $parentKey = $model->getKeyName();
        }
        $this->assertEquals($model->getTable().'.'.$parentKey, $relation->getQualifiedParentKeyName());
    }

    protected function assertBelongsToRelation(
        $relation,
        Model $model,
        Model $related,
        $foreignKey = null,
        $ownerKey = null
    ) {
        $this->assertInstanceOf(BelongsTo::class, $relation);

        $this->assertEquals($model, $relation->getParent());
        $this->assertEquals($related, $relation->getModel());

        if (is_null($foreignKey)) {
            $foreignKey = $related->getForeignKey();
        }
        $this->assertEquals($foreignKey, $relation->getForeignKeyName());

        if (is_null($ownerKey)) {
            $ownerKey = $related->getKeyName();
        }
        $this->assertEquals($ownerKey, $relation->getOwnerKeyName());
    }

    protected function assertBelongsToManyRelation(
        $relation,
        Model $model,
        Model $related,
        $foreignPivotKey,
        $relatedPivotKey
    ) {
        $this->assertInstanceOf(BelongsToMany::class, $relation);

        $this->assertEquals($model, $relation->getParent());
        $this->assertEquals($related, $relation->getModel());

        $this->assertEquals($foreignPivotKey, $relation->getQualifiedForeignPivotKeyName());
        $this->assertEquals($relatedPivotKey, $relation->getQualifiedRelatedPivotKeyName());
    }
}
