<?php

namespace App\Jobs;

use App\Mail\NewContactMessageMail;
use App\Models\Contact;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendNotificationMessageJob implements ShouldQueue
{
    use Queueable;

    public Contact $contact;

    /**
     * Create a new job instance.
     */
    public function __construct(Contact $contact)
    {
        $this->contact = $contact;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Mail::to('santiago9605es@gmail.com')->send(
            new NewContactMessageMail($this->contact)
        );
    }
}
