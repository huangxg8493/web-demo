let xml = '<?xml version="1.0" encoding="UTF-8"?>'+
'<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1eps1v9" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="17.2.1">'+
    '<bpmn:process id="Process_0a7n4yb" isExecutable="false">'+
    '<bpmn:startEvent id="StartEvent_1dwnlct">'+
    '<bpmn:outgoing>Flow_0gv3y3b</bpmn:outgoing>'+
'</bpmn:startEvent>'+
'<bpmn:sequenceFlow id="Flow_0gv3y3b" sourceRef="StartEvent_1dwnlct" targetRef="Activity_0303cne" />'+
'<bpmn:exclusiveGateway id="Gateway_0lath6a">'+
'<bpmn:incoming>Flow_1bcgk7p</bpmn:incoming>'+
'<bpmn:outgoing>Flow_0f1x83o</bpmn:outgoing>'+
'<bpmn:outgoing>Flow_1ciqjp8</bpmn:outgoing>'+
'</bpmn:exclusiveGateway>'+
'<bpmn:sequenceFlow id="Flow_1bcgk7p" sourceRef="Activity_0303cne" targetRef="Gateway_0lath6a" />'+
'<bpmn:sequenceFlow id="Flow_0f1x83o" sourceRef="Gateway_0lath6a" targetRef="Activity_14o0cm6" />'+
'<bpmn:sequenceFlow id="Flow_1ciqjp8" sourceRef="Gateway_0lath6a" targetRef="Activity_1j5zzxs" />'+
'<bpmn:sequenceFlow id="Flow_140qgge" sourceRef="Activity_14o0cm6" targetRef="Activity_0xdppip" />'+
'<bpmn:sequenceFlow id="Flow_02t0hwz" sourceRef="Activity_1j5zzxs" targetRef="Activity_0xdppip" />'+
'<bpmn:endEvent id="Event_0w0ovwl">'+
'<bpmn:incoming>Flow_0j8ih93</bpmn:incoming>'+
'</bpmn:endEvent>'+
'<bpmn:sequenceFlow id="Flow_0j8ih93" sourceRef="Activity_0xdppip" targetRef="Event_0w0ovwl" />'+
'<bpmn:userTask id="Activity_0303cne">'+
'<bpmn:incoming>Flow_0gv3y3b</bpmn:incoming>'+
'<bpmn:outgoing>Flow_1bcgk7p</bpmn:outgoing>'+
'</bpmn:userTask>'+
'<bpmn:userTask id="Activity_14o0cm6">'+
'<bpmn:incoming>Flow_0f1x83o</bpmn:incoming>'+
'<bpmn:outgoing>Flow_140qgge</bpmn:outgoing>'+
'</bpmn:userTask>'+
'<bpmn:userTask id="Activity_1j5zzxs">'+
'<bpmn:incoming>Flow_1ciqjp8</bpmn:incoming>'+
'<bpmn:outgoing>Flow_02t0hwz</bpmn:outgoing>'+
'</bpmn:userTask>'+
'<bpmn:userTask id="Activity_0xdppip">'+
'<bpmn:incoming>Flow_140qgge</bpmn:incoming>'+
'<bpmn:incoming>Flow_02t0hwz</bpmn:incoming>'+
'<bpmn:outgoing>Flow_0j8ih93</bpmn:outgoing>'+
'</bpmn:userTask>'+
'</bpmn:process>'+
'<bpmndi:BPMNDiagram id="BPMNDiagram_1">'+
'<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_0a7n4yb">'+
'<bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1dwnlct">'+
'<dc:Bounds x="156" y="232" width="36" height="36" />'+
'</bpmndi:BPMNShape>'+
'<bpmndi:BPMNShape id="Gateway_0lath6a_di" bpmnElement="Gateway_0lath6a" isMarkerVisible="true">'+
'<dc:Bounds x="415" y="225" width="50" height="50" />'+
'</bpmndi:BPMNShape>'+
'<bpmndi:BPMNShape id="Event_0w0ovwl_di" bpmnElement="Event_0w0ovwl">'+
'<dc:Bounds x="1002" y="232" width="36" height="36" />'+
'</bpmndi:BPMNShape>'+
'<bpmndi:BPMNShape id="Activity_16g9ewc_di" bpmnElement="Activity_0303cne">'+
'<dc:Bounds x="250" y="210" width="100" height="80" />'+
'</bpmndi:BPMNShape>'+
'<bpmndi:BPMNShape id="Activity_0a1gpmj_di" bpmnElement="Activity_14o0cm6">'+
'<dc:Bounds x="520" y="80" width="100" height="80" />'+
'</bpmndi:BPMNShape>'+
'<bpmndi:BPMNShape id="Activity_0xf80ii_di" bpmnElement="Activity_1j5zzxs">'+
'<dc:Bounds x="530" y="320" width="100" height="80" />'+
'</bpmndi:BPMNShape>'+
'<bpmndi:BPMNShape id="Activity_1nkjhv3_di" bpmnElement="Activity_0xdppip">'+
'<dc:Bounds x="790" y="210" width="100" height="80" />'+
'</bpmndi:BPMNShape>'+
'<bpmndi:BPMNEdge id="Flow_0gv3y3b_di" bpmnElement="Flow_0gv3y3b">'+
'<di:waypoint x="192" y="250" />'+
'<di:waypoint x="250" y="250" />'+
'</bpmndi:BPMNEdge>'+
'<bpmndi:BPMNEdge id="Flow_1bcgk7p_di" bpmnElement="Flow_1bcgk7p">'+
'<di:waypoint x="350" y="250" />'+
'<di:waypoint x="415" y="250" />'+
'</bpmndi:BPMNEdge>'+
'<bpmndi:BPMNEdge id="Flow_0f1x83o_di" bpmnElement="Flow_0f1x83o">'+
'<di:waypoint x="440" y="225" />'+
'<di:waypoint x="440" y="120" />'+
'<di:waypoint x="520" y="120" />'+
'</bpmndi:BPMNEdge>'+
'<bpmndi:BPMNEdge id="Flow_1ciqjp8_di" bpmnElement="Flow_1ciqjp8">'+
'<di:waypoint x="440" y="275" />'+
'<di:waypoint x="440" y="360" />'+
'<di:waypoint x="530" y="360" />'+
'</bpmndi:BPMNEdge>'+
'<bpmndi:BPMNEdge id="Flow_140qgge_di" bpmnElement="Flow_140qgge">'+
'<di:waypoint x="620" y="120" />'+
'<di:waypoint x="700" y="120" />'+
'<di:waypoint x="700" y="250" />'+
'<di:waypoint x="790" y="250" />'+
'</bpmndi:BPMNEdge>'+
'<bpmndi:BPMNEdge id="Flow_02t0hwz_di" bpmnElement="Flow_02t0hwz">'+
'<di:waypoint x="630" y="360" />'+
'<di:waypoint x="700" y="360" />'+
'<di:waypoint x="700" y="250" />'+
'<di:waypoint x="790" y="250" />'+
'</bpmndi:BPMNEdge>'+
'<bpmndi:BPMNEdge id="Flow_0j8ih93_di" bpmnElement="Flow_0j8ih93">'+
'<di:waypoint x="890" y="250" />'+
'<di:waypoint x="1002" y="250" />'+
'</bpmndi:BPMNEdge>'+
'</bpmndi:BPMNPlane>'+
'</bpmndi:BPMNDiagram>'+
'</bpmn:definitions>'