import server
import Bot_py
import multiprocessing

if __name__ == "__main__":
    p1 = multiprocessing.Process(target=Bot_py.bot.run())
    p2 = multiprocessing.Process(target=server.app.run(port=5000))
    
   # Start the processes
    p2.start()
    p1.start()

    # Wait for processes to complete
    p2.join()
    p1.join()

    print("Both services have completed")