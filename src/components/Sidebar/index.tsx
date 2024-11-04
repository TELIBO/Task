"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsSidebarCollapsed } from '@/state';
import { AlertCircle, ChevronDown, ChevronUp, ShieldAlert, X, Trash2, PlusSquare } from 'lucide-react';
import { useGetProjectsQuery, useDeleteProjectMutation } from '@/state/api';
import ModalNewProject from '@/app/projects/ModelNewProject';

const Sidebar = () => {
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);
  
  const { data: projects } = useGetProjectsQuery();
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  
  const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-xl transition-all duration-300 h-full z-40 dark:bg-black overflow-y-auto bg-white ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}`;

  return (
    <div className={sidebarClassNames}>
      <div className='flex h-[100%] w-full flex-col justify-start'>
        {/* TOP LOGO */}
        <div className='z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black'>
          <div className='text-xl font-bold text-gray-800 dark:text-white'>
            TaskFlow
          </div>
          {isSidebarCollapsed ? null : (
            <button
              className="py-3"
              onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
            >
              <X className="h-6 w-6 text-gray-800 hover:text-gray-500 dark:text-white" />
            </button>
          )}
        </div>
        
        {/* TEAM */}
        <div className='flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700'>
          <Image src="/logo.png" alt="logo" width={40} height={40} />
          <div>
            <h3 className='text-md font-bold tracking-wide dark:text-gray-200'>
              Sanjay's Team
            </h3>
            <div className='mt-1 flex items-start gap-2'>
              <p className='text-xs text-gray-500'>Private</p>
            </div>
          </div>
        </div>

        {/* NAVBAR LINKS */}
        <nav className='z-10 w-full'>
          {/* <SidebarLink label="Analysis" href="/" /> */}
          {/* <SidebarLink label="Search" href="/search" /> */}
          <SidebarLink label="Timeline" href="/timeline" />
          <SidebarLink label="Users" href="/users" />
          <button
            className="flex items-center rounded-md bg-blue-primary px-3 py-2 ml-7 my-3 text-white hover:bg-blue-600"
            onClick={() => setIsModalNewProjectOpen(true)}
          >
            <PlusSquare className="mr-2 h-5 w-5" /> New Boards
          </button>
          <ModalNewProject
                isOpen={isModalNewProjectOpen}
                onClose={() => setIsModalNewProjectOpen(false)}
            />
        </nav>

        {/* PROJECTS */}
        <button
          onClick={() => setShowProjects((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
        >
          <span>Projects</span>
          {showProjects ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        {showProjects && projects?.map((project) => (
          <SidebarLink
            key={project.id}
            label={project.name}
            href={`/projects/${project.id}`}
            projectId={project.id}
          />
        ))}

        {/* PRIORITIES */}
        {/* <button
          onClick={() => setShowPriority((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
        >
          <span>Priority</span>
          {showPriority ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        {showPriority && (
          <>
            <SidebarLink label="Urgent" href="/priority/urgent" />
            <SidebarLink label="High" href="/priority/high" />
            <SidebarLink label="Medium" href="/priority/medium" />
            <SidebarLink label="Low" href="/priority/low" />
            <SidebarLink label="Backlog" href="/priority/backlog" />
          </>
        )} */}
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  href: string;
  label: string;
  projectId?: number;
}

const SidebarLink = ({ href, label, projectId }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  const isProject = href.startsWith('/projects/');

  const [deleteProject] = useDeleteProjectMutation();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (projectId) {
      try {
        await deleteProject(projectId).unwrap();
        console.log('Project deleted:', label);
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  return (
    <a href={href} className="w-full">
      <div
        className={`relative flex cursor-pointer items-center justify-between transition-colors bg-white dark:bg-black hover:bg-gray-300 dark:hover:bg-gray-800 ${
          isActive ? 'bg-gray-100 text-white dark:bg-black' : ''
        } px-8 py-3`}
      >
        <div className="flex items-center gap-3">
          {isActive && <div className="absolute left-0 top-0 h-full w-[8px] bg-slate-600" />}
          <span className="font-medium text-gray-800 dark:text-gray-100">{label}</span>
        </div>
        {isProject && !isActive && (
          <button onClick={handleDelete} className="text-gray-500 hover:text-red-500 transition-colors">
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </a>
  );
};

export default Sidebar;
