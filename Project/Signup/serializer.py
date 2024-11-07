from .models import User, Profile
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
import re


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username','first_name','last_name','National_ID',
                  'Phone_Number', 'School_Name', 'Province', 'City', 'Address',
                  'email', 'School_Type', 'Education_Level', 'password', 'password2']


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['full_name'] = user.profile.full_name
        token['username'] = user.username
        token['National_ID'] = user.National_ID
        token['email'] = user.email
        token['bio'] = user.profile.bio
        token['image'] = str(user.profile.image)
        token['verified'] = user.profile.verified

        return token

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['id', 'username','first_name','last_name','National_ID',
                  'Phone_Number', 'School_Name', 'Province', 'City', 'Address',
                  'email', 'School_Type', 'Education_Level', 'password', 'password2']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {'password': 'Password fields does not match.'}
            )
        if not re.match('^[0-9]+$', attrs['National_ID']):
            serializers.ValidationError(
                {'National_ID': 'National ID field must contain only numbers.'}
            )
        if len(attrs['National_ID']) != 10:
            raise serializers.ValidationError(
                {'National_ID': 'National ID field must contain 10 numbers.'}
            )
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            National_ID=validated_data['National_ID'],
            Phone_Number=validated_data['Phone_Number'],
            School_Name=validated_data['School_Name'],
            Province=validated_data['Province'],
            City=validated_data['City'],
            Address=validated_data['Address'],
            School_Type=validated_data['School_Type'],
            Education_Level=validated_data['Education_Level'],
        )
        user.set_password(validated_data['password'])
        user.save()

        return user