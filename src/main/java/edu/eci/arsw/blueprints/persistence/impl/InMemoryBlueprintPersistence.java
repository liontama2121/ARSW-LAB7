/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.blueprints.persistence.impl;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import edu.eci.arsw.blueprints.persistence.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.persistence.BlueprintPersistenceException;
import edu.eci.arsw.blueprints.persistence.BlueprintsPersistence;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 *
 * @author hcadavid
 */
@Service("InMemoryBlueprintPersistence")
public class InMemoryBlueprintPersistence implements BlueprintsPersistence{

    private final Map<Tuple<String,String>,Blueprint> blueprints=new HashMap<>();

    public InMemoryBlueprintPersistence() {
        Point[] pts = new Point[]{new Point(140, 140),new Point(115, 115)};
        Blueprint bp = new Blueprint("_authorname_", "_bpname_ ",pts);
        blueprints.put(new Tuple<>(bp.getAuthor(),bp.getName()), bp);

        Point[] ptsJp=new Point[]{new Point(88, 45),new Point(39, 64),new Point(1254,546),new Point(7,8),new Point(4,2),new Point(11,22)};
        Blueprint bpJp=new Blueprint("author1", "Blueprint_a",ptsJp);
        blueprints.put(new Tuple<>(bpJp.getAuthor(),bpJp.getName()), bpJp);

        Point[] ptsSt=new Point[]{new Point(0, 1),new Point(1, 0)};
        Blueprint bpSt=new Blueprint("author2", "Blueprint_b",ptsSt);
        blueprints.put(new Tuple<>(bpSt.getAuthor(),bpSt.getName()), bpSt);

        Point[] ptsSt2=new Point[]{new Point(50, 1),new Point(1, 05)};
        Blueprint bpSt2=new Blueprint("author1", "School_blueprint",ptsSt2);
        blueprints.put(new Tuple<>(bpSt2.getAuthor(),bpSt2.getName()), bpSt2);
        
        Point[] pts1=new Point[]{new Point(140, 140),new Point(115, 115)};
        Point[] pts2= new Point[] {new Point(1,2),new Point(3,4),new Point(1,2)};
        Point[] pts3=new Point[]{new Point(14, 14),new Point(11, 15)};
        Blueprint bp1=new Blueprint("Ana", "bp1",pts1);
        Blueprint bp2=new Blueprint("Richard","bp2",pts2);
        Blueprint bp3=new Blueprint("Ana","bp3",pts3);
        blueprints.put(new Tuple<>(bp1.getAuthor(),bp1.getName()), bp1);
        blueprints.put(new Tuple<>(bp2.getAuthor(),bp2.getName()), bp2);
        blueprints.put(new Tuple<>(bp3.getAuthor(),bp3.getName()), bp3);
    }    
    
    @Override
    public void saveBlueprint(Blueprint bp) throws BlueprintPersistenceException {
        Blueprint blueprint= blueprints.putIfAbsent(new Tuple<>(bp.getAuthor(),bp.getName()), bp);
        if (blueprint!=null){
            throw new BlueprintPersistenceException("The given blueprint already exists: "+bp);
        }
    }

    @Override
    public Blueprint getBlueprint(String author, String bprintname) throws BlueprintNotFoundException {
        Blueprint bp=blueprints.get(new Tuple<>(author, bprintname));
        if(bp==null)throw new BlueprintNotFoundException("El plano con estas caracteristicas no existe");
        return blueprints.get(new Tuple<>(author, bprintname));
    }

    @Override
    public Set<Blueprint> getBlueprintsByAuthor(String author) throws BlueprintNotFoundException {
        Set<Blueprint> ans = new HashSet<>();
        Set<Tuple<String,String>> llaves = blueprints.keySet();
        for(Tuple<String,String> i : llaves){
            if(i.getElem1().equalsIgnoreCase(author)){
                ans.add(blueprints.get(i));
            }
        }
        if(ans.size()==0) throw new BlueprintNotFoundException("Este usuario no tiene planos");
        return ans;
    }

    @Override
    public Set<Blueprint> getAllBlueprints() {
        return new HashSet<Blueprint>(blueprints.values());
    }

    @Override
    public void updateBlueprint(Blueprint bp,String author,String name) throws BlueprintNotFoundException {
        Blueprint oldbp=getBlueprint(author,name);
        oldbp.setPoints(bp.getPoints());
    }

    @Override
    public void deleteBlueprint(String author, String name) {
        blueprints.keySet().remove(new Tuple<>(author,name));
    }

}
