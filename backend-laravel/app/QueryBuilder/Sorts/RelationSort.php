<?php

namespace App\QueryBuilder\Sorts;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Sorts\Sort;
use Illuminate\Support\Str;

class RelationSort implements Sort
{
    public function __construct(
        protected string $relation,
        protected string $column
    ) {}

    public function __invoke(Builder $query, bool $descending, string $property)
    {
        // We'll alias relation_name_column for deterministic sorting
        $alias = $this->relation . '_' . Str::snake($this->column) . '_sort';

        // Join the related table (if not already joined)
        $table = $query->getModel()->{$this->relation}()->getRelated()->getTable();
        $foreignKey = $query->getModel()->{$this->relation}()->getQualifiedForeignKeyName();
        $ownerKey   = $query->getModel()->{$this->relation}()->getOwnerKeyName();

        $query->leftJoin(
            $table,
            $foreignKey,
            '=',
            $table.'.'.$ownerKey
        );

        // Order by the related column
        $query->orderBy($table.'.'.$this->column, $descending ? 'desc' : 'asc');
    }
}