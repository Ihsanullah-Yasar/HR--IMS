<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\Sorts\Sort;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        //
    }

    public function boot()
    {
        AllowedSort::macro('relation', function (string $relation, string $column) {
            return AllowedSort::custom("{$relation}.{$column}", new class($relation, $column) implements Sort {
                public function __construct(private string $relation, private string $column) {}

                public function __invoke(Builder $query, bool $descending, string $property)
                {
                    $model     = $query->getModel();
                    $baseTable = $model->getTable();

                    // Resolve the relation instance from the model
                    $rel = $model->{$this->relation}();

                    // For now we support BelongsTo (department, createdBy, etc.)
                    if (! $rel instanceof BelongsTo) {
                        throw new \InvalidArgumentException("AllowedSort::relation only supports BelongsTo for now.");
                    }

                    $relatedTable           = $rel->getRelated()->getTable();
                    $foreignKeyQualified    = $rel->getQualifiedForeignKeyName(); // e.g. designations.department_id
                    $ownerKeyName           = $rel->getOwnerKeyName();            // e.g. id

                    // Make sure base table columns are selected (avoid ambiguous column errors)
                    if (empty($query->getQuery()->columns)) {
                        $query->select("{$baseTable}.*");
                    }

                    // Alias the joined table to avoid collisions if same table is joined multiple times
                    $alias = "{$relatedTable}__{$this->relation}";

                    $query->leftJoin("{$relatedTable} as {$alias}", $foreignKeyQualified, '=', "{$alias}.{$ownerKeyName}")
                          ->orderBy("{$alias}.{$this->column}", $descending ? 'desc' : 'asc');
                }
            });
        });
    }
}
