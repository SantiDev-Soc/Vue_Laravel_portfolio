<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Publication extends Model
{
    protected $table = 'publications';

    public $incrementing = false;
    protected $keyType = 'string';

    protected $casts = [
        'tags' => 'array',
    ];
    protected $fillable = [
        'id',
        'title',
        'title_en',
        'category',
        'category_en',
        'read_time',
        'read_time_en',
        'summary',
        'summary_en',
        'content',
        'content_en',
        'tags',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(static function ($model) {
            $model->id = (string) Str::uuid();
        });
    }
}
