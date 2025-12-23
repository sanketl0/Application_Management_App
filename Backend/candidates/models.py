from django.db import models
from django.core.validators import EmailValidator, RegexValidator

class Candidate(models.Model):
    """
    Model representing a job candidate in the recruitment system.
    """
    
    # Status choices for the candidate
    STATUS_CHOICES = [
        ('Applied', 'Applied'),
        ('Interview', 'Interview'),
        ('Selected', 'Selected'),
        ('Rejected', 'Rejected'),
    ]
    
    # Phone number validator - accepts 10 digit numbers
    phone_regex = RegexValidator(
        regex=r'^\d{10}$',
        message="Phone number must be exactly 10 digits."
    )
    
    # Fields
    name = models.CharField(
        max_length=255,
        help_text="Full name of the candidate"
    )
    
    email = models.EmailField(
        unique=True,
        validators=[EmailValidator()],
        help_text="Unique email address of the candidate"
    )
    
    phone = models.CharField(
        max_length=10,
        validators=[phone_regex],
        help_text="10-digit phone number"
    )
    
    position_applied = models.CharField(
        max_length=255,
        help_text="Job position the candidate applied for"
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Applied',
        help_text="Current status of the candidate application"
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the candidate was added"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the candidate was last updated"
    )
    
    class Meta:
        ordering = ['-created_at']  # Show newest candidates first
        verbose_name = 'Candidate'
        verbose_name_plural = 'Candidates'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['status']),
            models.Index(fields=['-created_at']),
        ]
    
    def __str__(self):
        return f"{self.name} - {self.position_applied} ({self.status})"
    
    def save(self, *args, **kwargs):
        # Convert email to lowercase before saving
        self.email = self.email.lower()
        super().save(*args, **kwargs)