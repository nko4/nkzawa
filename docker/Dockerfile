FROM ubuntu:12.04

# install open-ssh
RUN apt-get update -y
RUN apt-get install -y sudo
RUN apt-get install -y openssh-server

# we need to create privilege separation directory
RUN sudo mkdir /var/run/sshd

# ssh key for root
RUN sudo mkdir -p /root/.ssh; sudo chmod 700 /root/.ssh
ADD ./authorized_keys /root/.ssh/authorized_keys
RUN sudo chown root /root/.ssh/authorized_keys; chmod 600 /root/.ssh/authorized_keys

# open port
EXPOSE  22

# run openssh as deamon
CMD ["/usr/sbin/sshd", "-D"]
