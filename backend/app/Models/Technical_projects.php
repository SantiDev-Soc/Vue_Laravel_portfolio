<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Technical_projects extends Model
{
    protected $table = 'technical_projects';

    public $incrementing = false;
    protected $keyType = 'string';

    protected $casts = [
        'technologies' => 'array',
    ];
    protected $fillable = [
        'id',
        'title',
        'title_en',
        'description',
        'description_en',
        'status',
        'status_en',
        'technologies',
        'link_label',
        'link_label_en',
        'link_url',
        'category',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(static function ($model) {
            $model->id = (string) Str::uuid();
        });
    }
}
