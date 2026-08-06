<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Contact extends Model
{
    protected $table = 'contacts';

    protected $fillable = [
        'id',
        'name',
        'email',
        'subject',
        'message',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

     protected static function boot(): void
    {
        parent::boot();

        static::creating(static function ($model) {
            $model->id = (string) Str::uuid();
        });
    }
}
