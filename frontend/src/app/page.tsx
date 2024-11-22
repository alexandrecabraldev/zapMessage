'use client'
import Image from "next/image";
import { FormEvent, useRef, useState, useEffect } from "react";
import axios from "axios";
import { io } from 'socket.io-client'
import {v4 as uuidv4} from 'uuid'

interface TypeMessages{
  id:string;
  message: string;
  idClient:string;
}

export default function Home() {
  
  const inputFile = useRef<HTMLInputElement | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [defualtImageProfile, setDefaultImageProfile] = useState<string>('/defaultProfile/Avatar.png');
  const [idClient] = useState(uuidv4())
  const [mensages, setMensages] = useState<TypeMessages[]>([{
    id: uuidv4(),
    message:'Tive uma ideia incrível para um projeto! 😍',
    idClient:idClient
  }])

  //const [inputMessage, setInputMessage] = useState<string>('');
  
  const [socket] = useState(io('http://localhost:3333'))

  //console.log(mensages)

  useEffect(()=>{
    socket.on('connect',()=>{
      console.log('connect')
    })

    // socket.on('idClient',(id)=>{
    //     console.log('idClient: '+id)
    // })
    //socket.off('chatMessage')

    socket.on('chatMessage',(msg)=>{
      //console.log(msg)

      const msgServer= {
        id: uuidv4(),
        message: msg.message,
        idClient: msg.idClient
      }
      setMensages(state=>[...state, msgServer])
    })

    return ()=>{
      socket.off('chatMessage')
      socket.off('connect')
      //socket.off('idClient')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  function handleSubmit(event: FormEvent<HTMLFormElement>){
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const input = form.elements.namedItem('textMessage') as HTMLInputElement

    if(input.value !== ''){
      //console.log(idClient)
      socket.emit('chatMessage', {
        message:input.value,
        idClient: idClient
      })
      //setInputMessage(input.value)
      input.value= ''
    }
    
  }
 
  function handlerChangeImage(){

    if(inputFile.current){
      console.log(inputFile.current.files?.[0].name)
      const formData = new FormData()
      const data = inputFile.current.files?.[0]

      if(data){
        formData.append('avatar',data)
        setImageUrl(data.name)
      }

      axios.post('http://localhost:3333',formData).then((response)=>{
        //console.log(response)
      }).catch((err)=>{
        console.error(err)
      })
    }
   
  }

  function handleClick(){
    inputFile.current?.click();
  }

  return (
    <main className="flex flex-col items-center mx-8 my-6 lg:max-w-5xl lg:mx-auto lg:mt-8" >

      <header className="w-full mb-7">

        <input type="file"
          className="hidden" 
          name="avatar" 
          id="profile" 
          ref={inputFile}
          onChange={handlerChangeImage}
        />

        <div className="flex">

          <Image 
            className="cursor-pointer rounded-full"
            onClick={handleClick}
            src={imageUrl===null ? defualtImageProfile : `/upload/${imageUrl}`}
            width={50}
            height={50}
            alt="profile image"
          />

          <div className="flex flex-col pl-4">
            <span className="">Cecilia Sassaki</span>
            <span className="text-online">Online</span>

          </div>
        </div>
          
          <span className="block mt-6 text-center">Hoje 11:30</span>

      </header>

      <section className="w-full md:flex md:flex-col max-h-custom overflow-y-auto">
        

        {
          mensages.map((item)=>{

            //console.log(item.idClient)
            if(item.idClient === idClient){
              return (
                <div className="flex flex-col mt-7 md:mr-3" key={item.id}>
                  <span className="text-end block mb-2.5">Você - 11:32</span>
                  <div className="bg-chat2 rounded p-3.5 ml-auto">{item.message}</div>
                </div>
              )
            }else{
              return(
                <div className="" key={item.id}>
                  <span className="block mb-2.5">Cecilia - 11:30</span>
                  <div className="inline-block bg-chat1 rounded p-3.5">{item.message}</div>
                </div>
              )
            }
          })
        }
      </section>

      <form action=""
        className="relative mt-14 w-full"
        onSubmit={handleSubmit}
      >

        <input
          className="bg-input-custom rounded-full py-4 pl-6 pr-12 w-full" 
          type="text" 
          name="textMessage" 
          id="" 
          placeholder="Digite sua mensagem"
        />

        <button 
          className="absolute right-0 insert-2/4 mr-3 my-4"
          type="submit"
        >
          <Image
            src='/send.png'
            width={25}
            height={25}
            alt="botão de enviar mensagem"
          />
        </button>

      </form>
 
    </main>
  );
}


