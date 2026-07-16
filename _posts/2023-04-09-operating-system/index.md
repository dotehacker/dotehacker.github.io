---
title: "Operating System"
date: 2023-04-09
category: "Engineering"
tags: [Operating System, Computer Engineering, Notes, Systems]
---

An operating system (OS) is a software system that manages computer hardware and software resources and provides common services for computer programs. The main functions of an operating system include:

1. **Process management:** The OS manages the execution of computer programs, called processes, by allocating system resources such as memory, CPU time, and input/output devices.
2. **Memory management:** The OS manages the allocation and deallocation of memory resources to processes, ensuring that each process has the necessary memory to execute.
3. **File management:** The OS manages files and directories on the storage devices attached to the computer, providing services such as file creation, deletion, and access control.
4. **Device management:** The OS manages the input/output devices attached to the computer, including keyboards, mice, displays, printers, and storage devices, ensuring that processes can communicate with these devices.
5. **Security management:** The OS provides mechanisms for controlling access to system resources, protecting the system from unauthorized access and malicious software.
6. **Network management:** The OS provides services for communicating with other computers and networks, including protocols for sending and receiving data over the internet.

Overall, the operating system is responsible for managing the resources of the computer system and providing a platform for the execution of software applications.

## Functions of an Operating System

### 1. Process Management

Process management is one of the core functions of an operating system. It involves managing the execution of computer programs or processes. The OS allocates system resources such as memory, CPU time, and input/output devices to each process, ensuring that all processes can execute efficiently.

The OS also schedules processes based on priority, time-sharing, or other criteria, to ensure that all processes get a fair share of system resources. It also provides mechanisms for interprocess communication and synchronization, allowing processes to communicate with each other and share resources when needed.

### 2. Memory Management

Memory management is another important function of an operating system. It involves managing the allocation and deallocation of memory resources to processes. The OS ensures that each process has the necessary memory to execute, and it manages the allocation and deallocation of memory to optimize system performance.

The OS also provides virtual memory, which allows processes to use more memory than is physically available by using disk space as an extension of main memory. This helps to prevent system crashes due to insufficient memory.

### 3. File Management

File management is the function of an operating system that manages files and directories on the storage devices attached to the computer. The OS provides services such as file creation, deletion, renaming, copying, and access control.

The OS also provides file system drivers, which allow the computer to read and write data to different types of storage devices, such as hard drives, flash drives, and CD/DVD drives. The file system driver translates file requests from the OS into commands that can be understood by the storage device.

### 4. Device Management

Device management is the function of an operating system that manages the input/output devices attached to the computer, including keyboards, mice, displays, printers, and storage devices. The OS provides device drivers, which are software components that enable the computer to communicate with the devices.

The device drivers translate requests from the OS into commands that can be understood by the device, and they also manage the flow of data between the device and the computer. The OS also provides mechanisms for configuring and managing devices, such as device discovery, device installation, and device removal.

### 5. Security Management

Security management is the function of an operating system that provides mechanisms for controlling access to system resources, protecting the system from unauthorized access and malicious software. The OS provides user authentication mechanisms, such as passwords and biometric authentication, to ensure that only authorized users can access the system.

The OS also provides access control mechanisms, such as file permissions and user groups, to control access to system resources. It provides mechanisms for detecting and removing malware, such as antivirus software and firewalls.

### 6. Network Management

Network management is the function of an operating system that provides services for communicating with other computers and networks, including protocols for sending and receiving data over the internet. The OS provides network drivers, which enable the computer to communicate with different types of network hardware, such as Ethernet cards and wireless adapters.

The OS also provides network protocols, such as TCP/IP, which define how data is transmitted over the network. It provides network services, such as email and file sharing, which enable users to share data and communicate with each other over the network.

Overall, an operating system is a complex software system that performs many different functions to manage the resources of a computer system and provide a platform for the execution of software applications. Each function is critical to the overall performance and security of the system.

## Operating System as an Extended (Virtual) Machine

An operating system can be viewed as an extended or virtual machine because it provides an abstraction layer between the physical hardware of a computer and the software applications that run on it. This abstraction layer hides the details of the underlying hardware and provides a simplified and uniform interface to the software applications.

Like a virtual machine, an operating system provides a set of virtual resources to software applications, such as virtual CPU, virtual memory, virtual file system, virtual devices, and virtual network interfaces. These virtual resources are implemented by the operating system and mapped to the physical hardware resources as needed.

For example, when a software application requests memory from the operating system, the operating system provides virtual memory to the application, which is a portion of the physical memory that has been allocated to the application. The operating system manages the allocation and deallocation of virtual memory and maps it to the physical memory as needed, providing an illusion of unlimited memory to the application.

Similarly, when a software application requests access to a file, the operating system provides a virtual file system to the application, which is a logical representation of the physical storage devices attached to the computer. The virtual file system provides a uniform interface to the application for accessing files, regardless of the type of storage device or file system format used.

In this way, an operating system provides an abstraction layer that isolates software applications from the underlying hardware and provides a uniform interface to the software applications. This allows software applications to be written once and run on different hardware platforms without the need for modification, as long as they are compatible with the operating system.

## Evolution of Operating Systems

The evolution of operating systems can be divided into several major stages, each driven by technological advancements and user needs:

1. **Early Operating Systems:** In the early days of computing, operating systems were very simple and only provided basic functionality. They were typically designed to manage a single program at a time and were mainly used for scientific or engineering applications. Examples include the GM-NAA I/O system and the Atlas Supervisor.

2. **Batch Processing Operating Systems:** As computers became more powerful, operating systems evolved to support batch processing of jobs. These operating systems allowed multiple jobs to be submitted and processed in batches, without user intervention. Examples include IBM OS/360 and DEC PDP-8.

3. **Time-Sharing Operating Systems:** In the 1960s and 1970s, time-sharing operating systems were developed, allowing multiple users to share a single computer at the same time. Time-sharing operating systems used a technique called time-slicing to switch between users' programs rapidly. Examples include the UNIX operating system and the Multics system.

4. **Personal Computer Operating Systems:** In the 1980s, operating systems were developed for desktop and laptop computers, designed to be user-friendly with a graphical user interface (GUI). Examples include Microsoft Windows and Apple's macOS.

5. **Network Operating Systems:** In the 1990s, operating systems evolved to support networking. Examples include Novell NetWare and Microsoft Windows Server.

6. **Mobile Operating Systems:** In the 2000s and 2010s, mobile operating systems were developed to support smartphones and tablets, with a focus on touch-based interaction and mobile connectivity. Examples include Android and iOS.

7. **Cloud Operating Systems:** In recent years, operating systems have evolved to support cloud computing. Examples include Amazon Web Services, Microsoft Azure, and Google Cloud Platform.

## Types of Operating Systems

### Batch Operating System

A batch operating system processes jobs in batches, without requiring user interaction. Jobs are submitted to the system, and the operating system processes them in order, one after the other. Batch operating systems are often used in environments where large numbers of similar jobs need to be processed, such as in scientific or business applications.

### Interactive Operating System

An interactive operating system allows users to interact with the computer system in real-time. The operating system responds to user inputs immediately and provides a graphical user interface (GUI) for users to interact with. Interactive operating systems are commonly used on personal computers and mobile devices.

These systems typically provide a GUI that allows users to interact using a mouse, keyboard, or other input devices. Examples include Microsoft Windows, macOS, and Linux distributions with graphical desktop environments such as GNOME and KDE. They provide multitasking (running multiple applications simultaneously) and file management features.

### Multiprocessing Operating System

A multiprocessing operating system is designed to run on computers with multiple processors. The operating system can distribute processing tasks across multiple processors, allowing multiple programs to run simultaneously. Multiprocessing operating systems are often used in high-performance computing environments, such as scientific or engineering applications.

### Time-Sharing Operating System

A time-sharing operating system allows multiple users to access the same computer system at the same time. The operating system switches rapidly between users' programs, giving each user the illusion of having their own computer. Time-sharing operating systems are often used in environments where multiple users need to access a shared resource, such as in a university computer lab.

### Real-Time Operating System

A real-time operating system (RTOS) is designed to respond to events in real-time. The operating system must respond to events within a predetermined time frame, usually in the order of milliseconds or microseconds. RTOS is often used in embedded systems and real-time applications, such as robotics or avionics.

It's important to note that these types of operating systems are not mutually exclusive and can be combined to create hybrid operating systems.

## Operating System Components

### 1. Kernel

The kernel is the core component of the operating system, responsible for managing system resources such as memory, CPU, and input/output (I/O) devices. The kernel provides a layer of abstraction between hardware and software, allowing applications to access system resources without having to worry about the underlying hardware details.

### 2. Device Drivers

Device drivers are software components that allow the operating system to communicate with hardware devices such as printers, scanners, and network adapters. Device drivers provide a standardized interface for applications to interact with hardware devices, regardless of the specific hardware implementation.

### 3. File System

The file system is responsible for managing the storage and retrieval of data on the computer's hard drive or other storage media. The file system provides a hierarchical structure for organizing files and directories, and provides tools for creating, modifying, and deleting files.

### 4. User Interface

The user interface (UI) is the part of the operating system that allows users to interact with the computer. The UI provides a visual interface for users to launch applications, manage files, and perform other tasks. UI can be command-line interface (CLI) or graphical user interface (GUI).

### 5. System Services

System services are software components that provide additional functionality to the operating system. Examples of system services include process management, memory management, and security services. System services provide a standardized interface for applications to access advanced functionality, and they ensure that system resources are used efficiently and securely.

### 6. Application Programming Interface (API)

The API is a set of programming interfaces and protocols that allow developers to interact with the operating system. The API provides a standardized way for applications to access system resources and services, regardless of the underlying operating system implementation.

## Operating System Structure

### Monolithic Operating System

In a monolithic operating system, the entire operating system is designed as a single, large program that runs in kernel mode. All system services, including device drivers, file systems, and networking protocols, are integrated into the kernel. This structure provides efficient performance but makes the operating system difficult to modify and maintain.

The monolithic kernel architecture is based on the idea that having all the system services integrated into the kernel provides the best performance, as the kernel can access hardware directly without the overhead of passing data between different parts of the operating system. However, it makes the operating system difficult to modify and maintain, and can result in a larger kernel size.

Despite its disadvantages, the monolithic kernel architecture remains popular due to its efficient performance and ease of implementation. Examples include Linux, Unix, and earlier versions of Windows.

### Layered Operating System

In a layered operating system, the operating system is divided into a series of layers, with each layer providing a specific set of services. Each layer communicates with the layer above and below it through well-defined interfaces. This structure allows for easy modification and maintenance of the operating system, but can result in reduced performance due to the overhead of passing data between layers.

The layered structure kernel architecture typically consists of four main layers:

1. **Hardware Abstraction Layer (HAL):** Provides a standardized interface between the hardware and the rest of the operating system.
2. **Kernel Layer:** Provides core operating system services such as process management, memory management, and file system access.
3. **Operating System Services Layer:** Provides additional system services such as networking protocols, security services, and user interfaces.
4. **Application Layer:** Contains user applications and services.

Examples include the original versions of the Unix operating system and the VAX/VMS operating system.

### Micro-Kernel Operating System

In a micro-kernel operating system, the kernel provides only the most basic services, such as low-level process and memory management. All other operating system services, such as device drivers, file systems, and network protocols, are implemented as separate processes or servers that run in user space. These processes communicate with each other and the kernel through well-defined interfaces, using a message-passing mechanism.

**Advantages:**
- Modular design makes the operating system easier to modify and maintain
- Better security, as services are implemented as separate processes with their own address spaces
- Reliability: a failure in one service does not affect the entire system

**Disadvantages:**
- Reduced performance due to message-passing overhead
- Increased memory usage and complexity

Examples include MINIX, QNX, and GNU Hurd.

### Client-Server Operating System

In a client-server operating system, the operating system is divided into a set of server processes that provide specific services, such as file and print services. Client processes communicate with the server processes through well-defined interfaces, requesting and receiving services as needed. This structure provides high modularity and scalability, but can result in reduced performance due to the overhead of passing data between client and server processes.

### Virtual Machine Operating System

In a virtual machine operating system, the operating system provides a layer of abstraction between hardware and software, allowing multiple operating systems to run on the same hardware simultaneously. Each operating system runs in its own virtual machine, with the virtual machine providing a standardized interface for accessing hardware resources.

## Comparison: Monolithic vs. Microkernel

|  | Monolithic Kernel | Microkernel |
|---|---|---|
| Kernel size | Large | Small |
| Services | Integrated | Separated |
| Communication | Shared memory | Message passing |
| Performance | Good | Lower than monolithic kernel |
| Modularity | Poor | High |
| Reliability | Low | High |
| Security | Low | High |
| Examples of OS | Linux, Unix | MINIX, QNX, GNU Hurd |

## Virtual Machine Structure and Types of Supervision

A virtual machine (VM) is a software implementation of a physical machine that can run its own operating system and applications as if it were a separate physical computer. The VM provides an isolated environment that is logically independent of the underlying hardware, allowing multiple VMs to run on a single physical machine simultaneously.

A virtual machine is typically composed of two main components:

- **Virtual Machine Monitor (VMM) / Hypervisor:** Responsible for managing and allocating system resources such as CPU time, memory, and I/O devices to the virtual machines.
- **Virtual Machine:** Runs an operating system and applications just like a physical machine.

**Types of VM supervision:**

1. **Type 1 (bare-metal) hypervisors** run directly on the host machine's hardware, without the need for an underlying operating system. They are typically more efficient and secure, as they have direct access to hardware resources.

2. **Type 2 (hosted) hypervisors** run on top of an existing operating system, such as Windows or Linux. They are typically less efficient, as they rely on the underlying operating system for resource management.

**Types of virtual machines:**
- **System virtual machines:** Provide a complete virtualized environment, including virtual hardware and operating systems; used for software development, testing, and server consolidation.
- **Process virtual machines:** Only virtualize the application runtime environment, allowing applications to run in a sandboxed environment.
- **Hardware virtual machines:** Provide virtualized access to hardware resources; used for cloud computing and virtual desktop infrastructure (VDI).

**Benefits of VM structure over other OS structures:**

1. **Isolation:** Each VM is isolated from other VMs on the same physical machine, providing improved security and stability.
2. **Flexibility:** Multiple operating systems and applications can run on a single physical machine.
3. **Portability:** VMs can be easily moved between physical machines.
4. **Resource allocation:** The VMM can allocate system resources dynamically to each VM.
5. **Testing and development:** VMs can be used for testing software in a safe and isolated environment.

## Operating System Services

Operating system services are the functions that an operating system provides to applications and users:

1. **Process Management:** Managing processes, including creating, running, and terminating processes. Also provides inter-process communication (IPC) mechanisms.
2. **Memory Management:** Managing memory allocation and deallocation, including virtual memory and page swapping.
3. **File Management:** Services for creating, opening, closing, reading, and writing files. Also manages file permissions and provides directory services.
4. **Input/Output Management:** Services for managing input and output devices, such as keyboards, mice, and printers.
5. **Device Management:** Managing hardware devices, including drivers and device controllers.
6. **Network Management:** Services for managing network connections, including network protocols and interfaces.
7. **Security Management:** Services for authentication, access control, and data encryption.
8. **User Interface Management:** Services for managing user interfaces, including GUIs and CLIs.
9. **System Performance Monitoring:** Services for monitoring system performance, including resource utilization and error detection.
10. **Application Development:** Development tools and services, including compilers, debuggers, and libraries.

## System Calls

System calls are a mechanism that allows user-level processes to interact with the kernel of an operating system. They provide a way for user-level programs to request services from the kernel, such as creating or deleting files, reading from or writing to a network socket, allocating memory, and performing other privileged operations.

When a user-level program needs to perform an operation that requires privileged access, it makes a system call to the operating system kernel. The system call switches the program from user mode to kernel mode, where it can access system resources that are protected from user-level access. The kernel then performs the requested operation on behalf of the user-level program and returns control to the program when the operation is complete.

A **supervisor call** (also known as a system call) serves as an interface between user-level programs and the kernel, allowing programs to make requests for system services such as I/O, process management, memory allocation, and other operating system functions. Without the supervisor call mechanism, user-level programs would not be able to access system resources directly.

System calls are typically accessed through standard libraries (such as the C standard library), which provide a wrapper around the system call interface.

**Common system calls:**

1. `open()` — opens a file or device for reading or writing
2. `read()` — reads data from a file or device
3. `write()` — writes data to a file or device
4. `close()` — closes a file or device
5. `fork()` — creates a new process by duplicating the calling process
6. `exec()` — replaces the current process with a new process
7. `wait()` — waits for a child process to terminate
8. `exit()` — terminates the current process and returns a status code to the parent process

## Shell Commands

Shell commands are commands entered at the command line prompt of a shell, used to interact with the operating system and perform various tasks.

**Commonly used shell commands:**

1. `ls` — lists the files and directories in the current directory
2. `cd` — changes the current working directory
3. `mkdir` — creates a new directory
4. `rmdir` — removes a directory
5. `touch` — creates a new empty file or updates the timestamp of an existing file
6. `cp` — copies a file or directory
7. `mv` — moves or renames a file or directory
8. `rm` — removes a file or directory
9. `cat` — displays the contents of a file
10. `less` — displays the contents of a file, allowing scrolling and searching
11. `grep` — searches for a specific pattern in a file
12. `ps` — lists the currently running processes
13. `top` — displays the system resource usage, including CPU and memory usage
14. `ping` — tests network connectivity to a remote host
15. `ssh` — logs into a remote host using the secure shell protocol
16. `chmod` — changes the permissions of a file or directory
17. `chown` — changes the owner of a file or directory
18. `tar` — archives and compresses files and directories into a single file
19. `unzip` — extracts files from a compressed archive file
20. `man` — displays the manual page for a command

## Shell Programming

Shell programming is the process of writing scripts or programs using shell commands to automate tasks and perform system administration tasks. Shell scripts are simple text files that contain a series of commands executed sequentially by the shell interpreter.

The most commonly used shell for programming is the Bash shell (Bourne-Again SHell), which is the default shell on most Linux and Unix systems. Key features include:

1. **Variables:** Shell scripts can define and manipulate variables to store data and values.
2. **Control flow statements:** Shell scripts can use control flow statements like if-then-else and loops to control the flow of the program.
3. **Functions:** Shell scripts can define and use functions to encapsulate logic and perform complex tasks.
4. **Input and output:** Shell scripts can read input from the command line, files, or other sources, and output results to the screen or files.
5. **Error handling:** Shell scripts can handle errors and exit codes to ensure that the program runs smoothly.
6. **Command substitution:** Shell scripts can substitute the output of one command into another command or variable, allowing for more complex processing.

## Buffering and Spooling

Buffering and spooling are two techniques used by operating systems to improve performance and manage resources when dealing with input/output operations.

**Buffering** is the process of temporarily storing data in a buffer (a reserved area of memory) before it is processed by the computer. When data is read from a file or device, it is often read in blocks or chunks, and buffering allows the operating system to read the data in larger, more efficient chunks, reducing the number of input/output operations required.

**Spooling** (Simultaneous Peripheral Operations Online) is a technique used to manage input/output operations by queuing jobs in a buffer or spool. When a user sends a print job or other output request to the system, it is placed in a spool, which allows multiple jobs to be queued and processed in a more efficient manner.

Both buffering and spooling are important techniques for managing system resources and improving performance. Buffering manages data transfer rates while spooling manages overall system efficiency.

## Layered vs. Monolithic Structure

Whether the layered structure of an operating system is better than a monolithic structure depends on the specific requirements and use cases of the system in question.

- **Layered structure:** More modular and easier to maintain, since each layer can be developed and tested independently. However, the added complexity and overhead can result in decreased performance and increased resource usage.
- **Monolithic structure:** Faster performance and reduced resource usage, as there is no overhead from managing multiple layers. However, more difficult to maintain and update, as changes to one part of the system can have unintended consequences for other parts.

As an example, the Linux operating system (based on a monolithic structure) has been designed with performance and flexibility in mind. The monolithic structure allows the kernel to directly access hardware and system resources, resulting in faster and more efficient operation.

Ultimately, the choice depends on factors including the specific requirements of the system, the hardware and resources available, and the preferences and expertise of the development team.
