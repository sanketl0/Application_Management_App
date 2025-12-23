from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from candidates.models import Candidate


class Command(BaseCommand):
    help = "Creates test user and sample candidates for development"

    def handle(self, *args, **kwargs):
        # Create test user
        if not User.objects.filter(username="recruiter").exists():
            user = User.objects.create_user(
                username="recruiter",
                email="recruiter@gmail.com",
                password="password123",
                first_name="sanket",
                last_name="lodhe",
            )
            self.stdout.write(self.style.SUCCESS("Test user created"))
            self.stdout.write(f"  Username: recruiter")
            self.stdout.write(f"  Password: password123")
        else:
            self.stdout.write(self.style.WARNING("Test user already exists"))

        # Create sample candidates
        sample_candidates = [
            {
                "name": "Amit Sharma",
                "email": "amit.sharma@email.com",
                "phone": "9123456780",
                "position_applied": "Frontend Developer",
                "status": "Applied",
            },
            {
                "name": "Priya Verma",
                "email": "priya.verma@email.com",
                "phone": "9123456781",
                "position_applied": "Backend Developer",
                "status": "Interview",
            },
            {
                "name": "Rahul Mehta",
                "email": "rahul.mehta@email.com",
                "phone": "9123456782",
                "position_applied": "Full Stack Developer",
                "status": "Selected",
            },
            {
                "name": "Neha Gupta",
                "email": "neha.gupta@email.com",
                "phone": "9123456783",
                "position_applied": "UI/UX Designer",
                "status": "Rejected",
            },
            {
                "name": "Vikram Singh",
                "email": "vikram.singh@email.com",
                "phone": "9123456784",
                "position_applied": "DevOps Engineer",
                "status": "Applied",
            },
            {
                "name": "Anjali Patel",
                "email": "anjali.patel@email.com",
                "phone": "9123456785",
                "position_applied": "QA Engineer",
                "status": "Interview",
            },
            {
                "name": "Rohit Kulkarni",
                "email": "rohit.kulkarni@email.com",
                "phone": "9123456786",
                "position_applied": "Backend Developer",
                "status": "Applied",
            },
            {
                "name": "Sneha Iyer",
                "email": "sneha.iyer@email.com",
                "phone": "9123456787",
                "position_applied": "Data Analyst",
                "status": "Selected",
            },
            {
                "name": "Karan Malhotra",
                "email": "karan.malhotra@email.com",
                "phone": "9123456788",
                "position_applied": "Product Manager",
                "status": "Interview",
            },
            {
                "name": "Pooja Nair",
                "email": "pooja.nair@email.com",
                "phone": "9123456789",
                "position_applied": "Business Analyst",
                "status": "Applied",
            },
            {
                "name": "Saurabh Mishra",
                "email": "saurabh.mishra@email.com",
                "phone": "9133456780",
                "position_applied": "Cloud Engineer",
                "status": "Rejected",
            },
            {
                "name": "Meera Joshi",
                "email": "meera.joshi@email.com",
                "phone": "9133456781",
                "position_applied": "HR Executive",
                "status": "Applied",
            },
            {
                "name": "Arjun Reddy",
                "email": "arjun.reddy@email.com",
                "phone": "9133456782",
                "position_applied": "Mobile App Developer",
                "status": "Interview",
            },
            {
                "name": "Kavita Choudhary",
                "email": "kavita.choudhary@email.com",
                "phone": "9133456783",
                "position_applied": "Technical Writer",
                "status": "Selected",
            },
            {
                "name": "Nikhil Bansal",
                "email": "nikhil.bansal@email.com",
                "phone": "9133456784",
                "position_applied": "System Administrator",
                "status": "Applied",
            },
        ]

        created_count = 0
        for candidate_data in sample_candidates:
            if not Candidate.objects.filter(email=candidate_data["email"]).exists():
                Candidate.objects.create(**candidate_data)
                created_count += 1

        if created_count > 0:
            self.stdout.write(
                self.style.SUCCESS(f"Created {created_count} sample candidates")
            )
        else:
            self.stdout.write(self.style.WARNING("Sample candidates already exist"))
