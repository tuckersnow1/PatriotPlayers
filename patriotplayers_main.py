import streamlit as st

def main():
    st.title("PatriotPlayers")

    username = st.text_input("Username")
    password = st.text_input("Password", type="password")

    if st.button("Login"):
        if username == "admin" and password == "admin":
            st.success("Logged in successfully")
        else:
            st.error("Invalid credentials")

if __name__ == "__main__":
    main()
