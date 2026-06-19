<h2>New Developer Registration</h2>
<p>A new developer has registered for sandbox access.</p>

<h3>Details</h3>
<ul>
  <li><strong>Name:</strong> {{ $registration->contact_name }}</li>
  <li><strong>Email:</strong> {{ $registration->email }}</li>
  <li><strong>Organization:</strong> {{ $registration->organization_name ?: 'Not provided' }}</li>
  <li><strong>Type:</strong> {{ $registration->organization_type }}</li>
</ul>

<h3>Use Case</h3>
<p>{{ $registration->use_case ?: 'Not provided' }}</p>
