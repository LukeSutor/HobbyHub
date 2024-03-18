from hobbies_list import hobby_list
from users_list import users
import random
ADD_DATE = "2024-03-02 05:06:17.173066+00"

# Apply random [4, 6] hobbies to each user
def generate_dummy_data():
    file = open("./data_creation/dummy_data.csv", "w")
    file.write("id, created_at, user_id, name, skill\n")
    row = 2000
    for user in users:
        # Randomly select 4 to 6 hobbies for each user
        user_hobbies = random.sample(hobby_list, random.randint(4, 6))
        for hobby in user_hobbies:
            # Generate random skill level from 1 to 5 inclusive
            skill = random.randint(1, 5)
            line = f"{str(row)},{str(ADD_DATE)},{str(user)},{str(hobby)},{str(skill)}\n"
            file.write(line)
            row += 1

    file.close()      

if __name__ == "__main__":
    generate_dummy_data()