import { Appointment } from "@/modules/appointments/types/appointments-types";
import { differenceInMinutes } from "date-fns";

export interface LayoutAppointment extends Appointment {
  top: number;
  height: number;
  left: number;
  width: number;
}

export function calculateLayout(appointments: Appointment[]): LayoutAppointment[] {
    if (appointments.length === 0) return [];
    
    // 1. Sort by start time, then end time
    const sorted = [...appointments].sort((a, b) => {
        const startDiff = new Date(a.start).getTime() - new Date(b.start).getTime();
        if (startDiff !== 0) return startDiff;
        return new Date(b.end).getTime() - new Date(a.end).getTime();
    });

    // 2. Add layout properties (top, height)
    const withVerticals = sorted.map(apt => {
        const start = new Date(apt.start);
        const end = new Date(apt.end);
        
        // Calculate minutes from midnight
        const startMinutes = start.getHours() * 60 + start.getMinutes();
        const durationMinutes = differenceInMinutes(end, start);
        
        return {
            ...apt,
            top: startMinutes, // 1 min = 1 px
            height: Math.max(durationMinutes, 15), // Min 15 mins height
            left: 0,
            width: 100,
        };
    });

    // 3. Cluster overlapping events
    const clusters: LayoutAppointment[][] = [];
    let currentCluster: LayoutAppointment[] = [];
    
    for(const apt of withVerticals) {
       if (currentCluster.length === 0) {
           currentCluster.push(apt);
           continue;
       }

       const clusterEnd = Math.max(...currentCluster.map(a => a.top + a.height));
       // If this appointment starts before the cluster ends, it overlaps
       if (apt.top < clusterEnd) {
           currentCluster.push(apt);
       } else {
           clusters.push(currentCluster);
           currentCluster = [apt];
       }
    }
    if (currentCluster.length > 0) clusters.push(currentCluster);

    // 4. Assign columns within clusters
    const finalLayout: LayoutAppointment[] = [];

    for (const cluster of clusters) {
        const columns: LayoutAppointment[][] = [];
        
        for (const apt of cluster) {
            let placed = false;
            for (let i = 0; i < columns.length; i++) {
                const col = columns[i];
                if (!col) continue; // Should not happen
                
                const lastInCol = col[col.length - 1];
                if (lastInCol && (lastInCol.top + lastInCol.height <= apt.top)) {
                    col.push(apt);
                    placed = true;
                    break;
                }
            }
            if (!placed) {
                columns.push([apt]);
            }
        }

        const width = 100 / columns.length;
        
        columns.forEach((col, colIndex) => {
            col.forEach(apt => {
                apt.left = colIndex * width;
                apt.width = width;
                finalLayout.push(apt);
            });
        });
    }

    return finalLayout;
}
