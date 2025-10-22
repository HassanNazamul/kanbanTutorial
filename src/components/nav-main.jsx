import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, } from "@/components/ui/sidebar"
import { CircleDollarSign, UsersIcon, ChevronsUpDown } from "lucide-react";
import { Slider } from "./ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible"
import { useState } from "react";
import BudgetSlider from "./budget-slider";
import HeadCount from "./head-count";

export function NavMain({ items }) {

  // 1. State to hold the range. The array tells the slider to use two thumbs.
  const [priceRange, setPriceRange] = useState([200, 800]);

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>

          {/* Head Count Section */}

          <SidebarMenuItem className="border border-gray-500 rounded-md ">
            <Collapsible>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="Members">
                  <UsersIcon />
                  <span>Members</span>
                  <ChevronsUpDown className="h-4 w-4" />
                </SidebarMenuButton>
              </CollapsibleTrigger>

              {/* This content will now be toggled by the trigger */}
              <CollapsibleContent>
                {/* Use padding to indent the content under the button */}
                <HeadCount />
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>


          {/* Budget Section */}

          <SidebarMenuItem className="border border-gray-500 rounded-md ">
            <Collapsible>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="Budget">
                  <CircleDollarSign />
                  <span>Budget</span>
                  <ChevronsUpDown className="h-4 w-4" />
                </SidebarMenuButton>
              </CollapsibleTrigger>

              {/* This content will now be toggled by the trigger */}
              <CollapsibleContent>
                {/* Use padding to indent the content under the button */}
                <BudgetSlider />
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>


        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
