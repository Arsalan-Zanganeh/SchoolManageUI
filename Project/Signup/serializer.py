from .models import User, Profile
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
import re


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','first_name','last_name', 'National_ID', 'Phone_Number', 'password',
                  'password2', 'School_Name', 'School_Type', 'Education_Level', 'Province',
                  'City', 'Address']


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['full_name'] = user.profile.full_name
        token['bio'] = user.profile.bio
        token['image'] = str(user.profile.image)
        token['verified'] = user.profile.verified

        return token

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['id','first_name','last_name', 'National_ID', 'Phone_Number', 'password',
                  'password2', 'School_Name', 'School_Type', 'Education_Level', 'Province',
                  'City', 'Address']

    def validate(self, attrs):
   
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {'password': 'Password fields do not match.'}
            )
        if not re.match('^[0-9]{10}$', attrs['National_ID']):
            raise serializers.ValidationError(
                {'National_ID': 'National ID must contain exactly 10 digits.'}
            )
        if not re.match('^[0-9]{11}$', attrs['Phone_Number']):
            raise serializers.ValidationError(
                {'Phone_Number': 'Phone number must contain exactly 11 digits.'}
            )
        if not attrs.get('first_name'):
            raise serializers.ValidationError(
                {'first_name': 'First name cannot be empty.'}
            )
        if not attrs.get('last_name'):
            raise serializers.ValidationError(
                {'last_name': 'Last name cannot be empty.'}
            )
        if not attrs.get('School_Type'):
            raise serializers.ValidationError(
                {'School_Type': 'School type must be selected.'}
            )
        if not attrs.get('Education_Level'):
            raise serializers.ValidationError(
                {'Education_Level': 'Education level must be selected.'}
            )
        if not attrs.get('Province'):
            raise serializers.ValidationError(
                {'Province': 'Province cannot be empty.'}
            )
        if not attrs.get('City'):
            raise serializers.ValidationError(
                {'City': 'City cannot be empty.'}
            )
        if not attrs.get('Address'):
            raise serializers.ValidationError(
                {'Address': 'Address cannot be empty.'}
            )

        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            # username=validated_data['username'],
            # email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            username=validated_data['National_ID'],
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