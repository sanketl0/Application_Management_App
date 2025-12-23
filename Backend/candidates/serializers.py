from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Candidate

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model - used for login response
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class LoginSerializer(serializers.Serializer):
    """
    Serializer for login request
    """
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            raise serializers.ValidationError("Both username and password are required.")
        
        return data


class CandidateSerializer(serializers.ModelSerializer):
    """
    Main serializer for Candidate model with all fields
    """
    class Meta:
        model = Candidate
        fields = [
            'id',
            'name',
            'email',
            'phone',
            'position_applied',
            'status',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_email(self, value):
        """
        Validate email uniqueness
        """
        # Convert to lowercase for comparison
        value = value.lower()
        
        # Check if email already exists (excluding current instance during update)
        instance = self.instance
        if instance:
            # Update case - exclude current candidate
            if Candidate.objects.filter(email=value).exclude(id=instance.id).exists():
                raise serializers.ValidationError("A candidate with this email already exists.")
        else:
            # Create case - check if email exists
            if Candidate.objects.filter(email=value).exists():
                raise serializers.ValidationError("A candidate with this email already exists.")
        
        return value
    
    def validate_phone(self, value):
        """
        Validate phone number format
        """
        if not value.isdigit():
            raise serializers.ValidationError("Phone number must contain only digits.")
        
        if len(value) != 10:
            raise serializers.ValidationError("Phone number must be exactly 10 digits.")
        
        return value
    
    def validate_name(self, value):
        """
        Validate name is not empty and contains valid characters
        """
        if not value.strip():
            raise serializers.ValidationError("Name cannot be empty.")
        
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long.")
        
        return value.strip()
    
    def validate_position_applied(self, value):
        """
        Validate position is not empty
        """
        if not value.strip():
            raise serializers.ValidationError("Position applied cannot be empty.")
        
        return value.strip()


class CandidateStatusSerializer(serializers.ModelSerializer):
    """
    Serializer for updating only the status field
    """
    class Meta:
        model = Candidate
        fields = ['id', 'status']
        read_only_fields = ['id']
    
    def validate_status(self, value):
        """
        Validate status is one of the allowed choices
        """
        allowed_statuses = ['Applied', 'Interview', 'Selected', 'Rejected']
        if value not in allowed_statuses:
            raise serializers.ValidationError(
                f"Status must be one of: {', '.join(allowed_statuses)}"
            )
        return value


class CandidateListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for list view - excludes timestamps
    """
    class Meta:
        model = Candidate
        fields = ['id', 'name', 'email', 'phone', 'position_applied', 'status']