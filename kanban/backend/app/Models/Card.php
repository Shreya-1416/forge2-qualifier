<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    protected $fillable = [
        'board_list_id',
        'title',
        'description',
        'label',
        'assignee',
        'due_date'
    ];

    public function list()
    {
        return $this->belongsTo(BoardList::class);
    }
}