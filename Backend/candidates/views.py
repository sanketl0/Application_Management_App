from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Candidate
from .serializers import (
    CandidateSerializer,
    CandidateStatusSerializer,
    CandidateListSerializer,
    LoginSerializer,
    UserSerializer
)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    API endpoint for user login
    POST /api/login/
    
    Request body:
    {
        "username": "string",
        "password": "string"
    }
    
    Response:
    {
        "token": "string",
        "user": {
            "id": int,
            "username": "string",
            "email": "string",
            "first_name": "string",
            "last_name": "string"
        }
    }
    """
    serializer = LoginSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(
            {'error': 'Invalid input', 'details': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    username = serializer.validated_data['username']
    password = serializer.validated_data['password']
    
    # Authenticate user
    user = authenticate(username=username, password=password)
    
    if user is None:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    if not user.is_active:
        return Response(
            {'error': 'User account is disabled'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Get or create token
    token, created = Token.objects.get_or_create(user=user)
    
    # Serialize user data
    user_serializer = UserSerializer(user)
    
    return Response({
        'token': token.key,
        'user': user_serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    API endpoint for user logout
    POST /api/logout/
    """
    try:
        # Delete the user's token
        request.user.auth_token.delete()
        return Response(
            {'message': 'Successfully logged out'},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class CandidateViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing candidates
    
    Endpoints:
    - GET    /api/candidates/          -> List all candidates (with pagination, search, filter)
    - POST   /api/candidates/          -> Create new candidate
    - GET    /api/candidates/{id}/     -> Retrieve single candidate
    - PUT    /api/candidates/{id}/     -> Update candidate (full update)
    - PATCH  /api/candidates/{id}/     -> Partial update candidate
    - DELETE /api/candidates/{id}/     -> Delete candidate
    - PATCH  /api/candidates/{id}/status/ -> Update only status
    """
    
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer
    permission_classes = [IsAuthenticated]
    
    # Enable filtering, searching, and ordering
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    
    # Filter by status
    filterset_fields = ['status']
    
    # Search by name and email
    search_fields = ['name', 'email']
    
    # Allow ordering by created_at and name
    ordering_fields = ['created_at', 'name']
    ordering = ['-created_at']  # Default ordering
    
    def get_serializer_class(self):
        """
        Use different serializers for different actions
        """
        if self.action == 'list':
            return CandidateListSerializer
        elif self.action == 'update_status':
            return CandidateStatusSerializer
        return CandidateSerializer
    
    def list(self, request, *args, **kwargs):
        """
        Override list to add custom response format
        GET /api/candidates/
        
        Query parameters:
        - page: page number for pagination
        - search: search by name or email
        - status: filter by status (Applied, Interview, Selected, Rejected)
        """
        queryset = self.filter_queryset(self.get_queryset())
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        """
        Create a new candidate
        POST /api/candidates/
        """
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {'error': 'Validation failed', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        self.perform_create(serializer)
        
        return Response(
            {
                'message': 'Candidate created successfully',
                'data': serializer.data
            },
            status=status.HTTP_201_CREATED
        )
    
    def update(self, request, *args, **kwargs):
        """
        Update candidate (full update)
        PUT /api/candidates/{id}/
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if not serializer.is_valid():
            return Response(
                {'error': 'Validation failed', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        self.perform_update(serializer)
        
        return Response({
            'message': 'Candidate updated successfully',
            'data': serializer.data
        })
    
    def destroy(self, request, *args, **kwargs):
        """
        Delete candidate
        DELETE /api/candidates/{id}/
        """
        instance = self.get_object()
        candidate_name = instance.name
        self.perform_destroy(instance)
        
        return Response(
            {'message': f'Candidate "{candidate_name}" deleted successfully'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['patch'], url_path='status')
    def update_status(self, request, pk=None):
        """
        Update only the status of a candidate
        PATCH /api/candidates/{id}/status/
        
        Request body:
        {
            "status": "Interview" | "Selected" | "Rejected" | "Applied"
        }
        """
        candidate = self.get_object()
        serializer = CandidateStatusSerializer(candidate, data=request.data, partial=True)
        
        if not serializer.is_valid():
            return Response(
                {'error': 'Validation failed', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer.save()
        
        return Response({
            'message': f'Status updated to {serializer.data["status"]}',
            'data': serializer.data
        }, status=status.HTTP_200_OK)