<?php

namespace App\Mail;

use App\Models\DeveloperRegistration;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DeveloperRegistrationConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public DeveloperRegistration $registration)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Welcome to NIFN Developers');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.developer-registration-confirmation');
    }
}
